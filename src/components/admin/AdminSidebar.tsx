'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  PhotoIcon, 
  ChartBarIcon, 
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: HomeIcon, description: 'Main dashboard' },
    ]
  },
  {
    name: 'Content Management',
    items: [
      { name: 'Page Audits', href: '/admin/page-audits', icon: ClipboardDocumentListIcon, description: 'View all page audits' },
      { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon, description: 'Generated reports' },
      { name: 'Screenshots', href: '/admin/screenshots', icon: CameraIcon, description: 'Screenshot gallery' },
    ]
  },
  {
    name: 'References',
    items: [
      { name: 'Image Reference', href: '/admin/image-references', icon: PhotoIcon, description: 'Image assets' },
      { name: 'App Reference', href: '/admin/app-reference', icon: Squares2X2Icon, description: 'App integrations' },
      { name: 'Industry Management', href: '/admin/industries', icon: BuildingOfficeIcon, description: 'Industry categories' },
    ]
  },
  {
    name: 'System',
    items: [
      { name: 'Users', href: '/admin/user', icon: UserGroupIcon, description: 'User management' },
      { name: 'Analytics', href: '/#', icon: ChartBarIcon, description: 'System analytics' },
      { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, description: 'System settings' },
    ]
  },
];

export default function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-6 pb-4">
                  {/* Header */}
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-xs text-gray-500">Fix My Store</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-6">
                      {navigation.map((section) => (
                        <li key={section.name}>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {section.name}
                          </div>
                          <ul role="list" className="space-y-1">
                            {section.items.map((item) => {
                              const isActive = pathname === item.href;
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={`
                                      group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                                      ${isActive
                                        ? 'bg-black text-white shadow-lg shadow-green-500/25'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                      }
                                    `}
                                    onClick={() => setOpen(false)}
                                  >
                                    <item.icon
                                      className={`h-5 w-5 shrink-0 ${
                                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                                      }`}
                                      aria-hidden="true"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="truncate">{item.name}</div>
                                      <div className={`text-xs truncate ${
                                        isActive ? 'text-green-100' : 'text-gray-500'
                                      }`}>
                                        {item.description}
                                      </div>
                                    </div>
                                    {isActive && (
                                      <ChevronRightIcon className="h-4 w-4 text-white" />
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white px-6 pb-4">
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Fix My Store</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-6">
              {navigation.map((section) => (
                <li key={section.name}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                    {section.name}
                  </div>
                  <ul role="list" className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`
                              group flex items-center gap-x-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                              ${isActive
                                ? 'bg-black text-white shadow-lg shadow-green-500/25'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                              }
                            `}
                          >
                            <item.icon
                              className={`h-5 w-5 shrink-0 ${
                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                              }`}
                              aria-hidden="true"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">{item.name}</div>
                              <div className={`text-xs truncate ${
                                isActive ? 'text-green-100' : 'text-gray-500'
                              }`}>
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <ChevronRightIcon className="h-4 w-4 text-white" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Fix My Store Admin</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 