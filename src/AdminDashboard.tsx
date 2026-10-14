import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDownTrayIcon, ArrowLeftIcon, ArrowPathIcon, ArrowRightOnRectangleIcon, Bars3Icon, BellIcon,
  BookOpenIcon, ChartBarIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon,
  Cog6ToothIcon, DocumentTextIcon, EyeIcon, FunnelIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon,
  PrinterIcon, ShieldCheckIcon, Squares2X2Icon, TicketIcon, UserGroupIcon, XMarkIcon,
} from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/solid'
import logo from './assets/libon-logo.png'
import streetlightEvidence from './assets/demo-streetlight-evidence.png'
import {
  CONTENT_SECTIONS, OFFICES, STATUSES, addActivity, csvDataUrl, formatDate, hasDemoStoreError, reloadDemoStore, resetDemoStore,
  updateDemoStore, useDemoStore,
  type AdminUser, type ContentItem, type ContentSection, type ContentStatus, type DemoState,
  type RouteRule, type Ticket, type TicketStatus,
} from './demoStore'
import './admin.css'

type IconType = typeof Squares2X2Icon
type ConfirmRequest = { title: string; body: string; label: string; run: () => void }
type AdminProps = { path: string; navigate: (path: string) => void }
const NAV: { label: string; path: string; icon: IconType }[] = [
  { label: 'Overview', path: '/admin', icon: Squares2X2Icon },
  { label: 'Tickets', path: '/admin/tickets', icon: TicketIcon },
  { label: 'Content', path: '/admin/content', icon: DocumentTextIcon },
  { label: 'Knowledge & Routing', path: '/admin/knowledge', icon: BookOpenIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
  { label: 'Users & Activity', path: '/admin/users', icon: UserGroupIcon },
]
const STATUS_STYLE: Record<TicketStatus, string> = {
  Submitted: 'submitted', Received: 'received', Assigned: 'assigned', 'Action Taken': 'action', Resolved: 'resolved',
}
const sectionSlug = (section: ContentSection) => section === 'Knowledge Base' ? 'knowledge-base' : section.toLowerCase()
const fromSlug = (slug: string): ContentSection => CONTENT_SECTIONS.find(section => sectionSlug(section) === slug) ?? 'Services'
const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))
const displayDate = (value: string) => value ? formatDate(value, true) : '—'
const numberPercent = (part: number, total: number) => total ? Math.round(part / total * 100) : 0
const isWithin = (value: string, range: string) => {
  if (range === 'all') return true
  const days = range === '7' ? 7 : range === '30' ? 30 : 90
  return new Date(value).getTime() >= Date.now() - days * 86400000
}
const ticketCsvRows = (tickets: Ticket[]) => [
  ['Ticket ID', 'Category', 'Date Submitted', 'Status', 'Assigned Office', 'Location', 'Last Updated'],
  ...tickets.map(ticket => [ticket.id, ticket.category, formatDate(ticket.submittedAt), ticket.status, ticket.office || 'Unassigned', ticket.location, formatDate(ticket.updatedAt)]),
]

function StatusBadge({ value }: { value: string }) {
  const style = value in STATUS_STYLE ? STATUS_STYLE[value as TicketStatus] : value.toLowerCase().replaceAll(' ', '-')
  return <span className={`adm-badge adm-badge-${style}`}>{value}</span>
}
function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`adm-panel ${className}`}><div className="adm-panel-head"><h2>{title}</h2>{action}</div>{children}</section>
}
function Empty({ title, detail }: { title: string; detail?: string }) {
  return <div className="adm-empty"><ClipboardDocumentListIcon width={26} /><strong>{title}</strong>{detail && <span>{detail}</span>}</div>
}
function Modal({ title, children, onClose, footer }: { title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  return <div className="adm-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="adm-modal-head"><h2>{title}</h2><button className="adm-icon-btn" onClick={onClose} aria-label="Close"><XMarkIcon /></button></div>
      <div className="adm-modal-body">{children}</div>{footer && <div className="adm-modal-foot">{footer}</div>}
    </div>
  </div>
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="adm-field"><span>{label}</span>{children}</label> }
function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map(row => row.value))
  return <div className="adm-bars">{rows.map(row => <div className="adm-bar-row" key={row.label}>
    <span>{row.label}</span><div className="adm-bar-track"><i style={{ width: `${row.value / max * 100}%` }} /></div><strong>{row.value}</strong>
  </div>)}</div>
}
function EvidencePreview({ label, category }: { label: string; category: string }) {
  return <div className="adm-evidence" role="img" aria-label={label}>
    {category.includes('Streetlight') ? <img src={streetlightEvidence} alt="" /> : <svg viewBox="0 0 320 160" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="160" fill="#bcc8c3" /><rect y="106" width="320" height="54" fill="#6c7c70" />
      <path d="M0 116L320 116M165 116L216 160M151 116L118 160" stroke="#e5e7dc" strokeWidth="3" />
      <path d="M96 118V25M95 26h63l15 12" stroke="#33423c" strokeWidth="6" fill="none" />
      <path d="M168 37h14l-3 7h-17z" fill="#f1c232" /><circle cx="174" cy="48" r="20" fill="#f1c232" opacity=".18" />
      <path d="M0 105q34-38 68 0M242 105q30-44 78 0" fill="#4b6651" />
    </svg>}<span>ILLUSTRATIVE DEMO EVIDENCE</span>
  </div>
}

export default function AdminDashboard({ path, navigate }: AdminProps) {
  const data = useDemoStore()
  const url = new URL(path, window.location.origin)
  const route = url.pathname
  const segments = route.split('/').filter(Boolean)
  const ticketId = segments[1] === 'tickets' && segments[2] ? segments[2] : ''
  const recordMode = segments[3] === 'record'
  const contentSection = fromSlug(segments[2] || 'services')
  const user = data.users.find(item => item.id === data.activeUserId) ?? data.users[0]
  const canManageTickets = user.role === 'System Administrator' || user.role === 'Office Focal Person'
  const canManageContent = user.role === 'System Administrator' || user.role === 'Content Manager'
  const canManageUsers = user.role === 'System Administrator'
  const visibleTickets = user.role === 'Office Focal Person' ? data.tickets.filter(item => item.office === user.office) : data.tickets
  const ticket = visibleTickets.find(item => item.id === ticketId)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signedOut, setSignedOut] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [overviewRange, setOverviewRange] = useState('all')
  const [overviewOffice, setOverviewOffice] = useState('all')
  const [ticketSearch, setTicketSearch] = useState(url.searchParams.get('q') ?? '')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [officeFilter, setOfficeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [analyticsRange, setAnalyticsRange] = useState('all')
  const [analyticsOffice, setAnalyticsOffice] = useState('all')
  const [analyticsCategory, setAnalyticsCategory] = useState('all')
  const [assignOffice, setAssignOffice] = useState(ticket?.office || ticket?.suggestedOffice || OFFICES[0])
  const [focal, setFocal] = useState(ticket?.focal || '')
  const [statusChoice, setStatusChoice] = useState<TicketStatus | ''>('')
  const [publicNote, setPublicNote] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [contentDraft, setContentDraft] = useState<ContentItem | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null)
  const [ruleDraft, setRuleDraft] = useState<RouteRule | null>(null)
  const [userDraft, setUserDraft] = useState<AdminUser | null>(null)

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3200); return () => window.clearTimeout(timer) }, [toast])
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setTicketSearch(params.get('q') ?? '')
    setStatusFilter(STATUSES.includes(params.get('status') as TicketStatus) ? params.get('status')! : 'all')
  }, [path])
  useEffect(() => { setAssignOffice(ticket?.office || ticket?.suggestedOffice || OFFICES[0]); setFocal(ticket?.focal || ''); setStatusChoice(''); setPublicNote(''); setInternalNote('') }, [ticketId])
  useEffect(() => { setStatusChoice('') }, [ticket?.status])
  useEffect(() => { setMenuOpen(false); setNotificationsOpen(false) }, [path])

  const change = (operation: (draft: DemoState) => void, success: string) => { updateDemoStore(operation); setToast(success) }
  const ask = (title: string, body: string, label: string, run: () => void) => setConfirm({ title, body, label, run })
  const refresh = () => {
    setLoading(true)
    window.setTimeout(() => { reloadDemoStore(); setLoading(false); if (!hasDemoStoreError()) setToast('Local demo data refreshed.') }, 350)
  }
  const clearQueueFilters = () => { setTicketSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setOfficeFilter('all'); setDateFilter('all'); setSort('newest'); setPage(1); if (url.search) navigate('/admin/tickets') }

  const queue = useMemo(() => {
    const query = ticketSearch.trim().toLowerCase()
    return visibleTickets.filter(item =>
      (!query || [item.id, item.category, item.location, item.summary].some(value => value.toLowerCase().includes(query))) &&
      (statusFilter === 'all' || item.status === statusFilter) && (categoryFilter === 'all' || item.category === categoryFilter) &&
      (officeFilter === 'all' || (officeFilter === 'Unassigned' ? !item.office : item.office === officeFilter)) && isWithin(item.submittedAt, dateFilter),
    ).sort((a, b) => sort === 'oldest' ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      : sort === 'status' ? STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
      : sort === 'category' ? a.category.localeCompare(b.category) : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [visibleTickets, ticketSearch, statusFilter, categoryFilter, officeFilter, dateFilter, sort])
  const analyticsTickets = visibleTickets.filter(item => isWithin(item.submittedAt, analyticsRange) &&
    (analyticsOffice === 'all' || item.office === analyticsOffice) && (analyticsCategory === 'all' || item.category === analyticsCategory))
  const overviewTickets = visibleTickets.filter(item => isWithin(item.submittedAt, overviewRange) && (overviewOffice === 'all' || item.office === overviewOffice))
  const activity = data.activity.slice(0, 6)
  const pendingCount = data.tickets.filter(item => item.status === 'Submitted' || item.status === 'Received').length + data.content.filter(item => item.status === 'Pending Verification').length

  const assignTicket = () => {
    if (!ticket || !canManageTickets || (user.role === 'Office Focal Person' && ticket.office !== user.office)) return
    ask(`Assign ${ticket.id}?`, `Route this ticket to ${assignOffice}${focal.trim() ? `, focal person ${focal.trim()}` : ''}. Authorized staff can change this later.`, 'Confirm assignment', () => {
      change(draft => {
        const item = draft.tickets.find(entry => entry.id === ticket.id)!
        const reassigned = Boolean(item.office && item.office !== assignOffice)
        item.office = assignOffice; item.focal = focal.trim(); item.routingAccepted = !reassigned && assignOffice === item.suggestedOffice
        if (item.status === 'Submitted') {
          item.history.push({ status: 'Received', at: new Date().toISOString(), actor: user.name, note: 'Report acknowledged for staff review.' })
        }
        if (STATUSES.indexOf(item.status) < STATUSES.indexOf('Assigned')) {
          item.status = 'Assigned'; item.history.push({ status: 'Assigned', at: new Date().toISOString(), actor: user.name, note: `Assigned to ${assignOffice}.` })
        }
        item.updatedAt = new Date().toISOString()
        addActivity(draft, user.name, `${reassigned ? 'Reassigned' : 'Assigned'} to ${assignOffice}`, item.id)
      }, 'Ticket assignment saved.')
      if (user.role === 'Office Focal Person' && assignOffice !== user.office) navigate('/admin/tickets')
    })
  }
  const updateStatus = () => {
    if (!ticket || !statusChoice || !canManageTickets || (user.role === 'Office Focal Person' && ticket.office !== user.office) || STATUSES.indexOf(statusChoice) !== STATUSES.indexOf(ticket.status) + 1) return
    if (statusChoice === 'Resolved' && !publicNote.trim()) { setToast('A public resolution note is required.'); return }
    ask(`Change status to ${statusChoice}?`, `This public status change will appear in citizen tracking for linked reports.`, 'Confirm status', () => {
      change(draft => {
        const item = draft.tickets.find(entry => entry.id === ticket.id)!
        item.status = statusChoice
        item.updatedAt = new Date().toISOString()
        item.history.push({ status: statusChoice, at: item.updatedAt, actor: user.name, note: publicNote.trim() || `${statusChoice} by authorized LGU personnel.` })
        addActivity(draft, user.name, `Changed status to ${statusChoice}`, item.id)
      }, 'Ticket status updated.')
      setStatusChoice(''); setPublicNote('')
    })
  }
  const addPublicNote = () => {
    if (!ticket || !publicNote.trim() || !canManageTickets) return
    ask(`Post public update for ${ticket.id}?`, 'Residents tracking this report will be able to read this note.', 'Post update', () => {
      change(draft => {
        const item = draft.tickets.find(entry => entry.id === ticket.id)!
        item.updatedAt = new Date().toISOString()
        item.history.push({ status: item.status, at: item.updatedAt, actor: user.name, note: publicNote.trim() })
        addActivity(draft, user.name, 'Posted public status update', item.id)
      }, 'Public update posted.')
      setPublicNote('')
    })
  }
  const addInternalNote = () => {
    if (!ticket || !internalNote.trim() || !canManageTickets) return
    change(draft => {
      const item = draft.tickets.find(entry => entry.id === ticket.id)!
      item.notes.unshift({ id: `n${Date.now()}`, at: new Date().toISOString(), actor: user.name, text: internalNote.trim() })
      item.updatedAt = new Date().toISOString()
      addActivity(draft, user.name, 'Added internal note', item.id)
    }, 'Internal note saved.')
    setInternalNote('')
  }

  const saveContent = (status?: ContentStatus) => {
    if (!contentDraft || !contentDraft.title.trim() || !canManageContent) { setToast('Enter a title before saving.'); return }
    const wasPublished = data.content.some(item => item.id === contentDraft.id && item.status === 'Published')
    const final = { ...contentDraft, title: contentDraft.title.trim(), status: status ?? (contentDraft.status === 'Published' && !wasPublished ? 'Draft' : contentDraft.status), updatedAt: new Date().toISOString(), updatedBy: user.name }
    if (final.status === 'Published' && ![final.category, final.office, final.body, final.source].every(value => value.trim())) { setToast('Published content needs a category, office, body, and verification source.'); return }
    change(draft => {
      const index = draft.content.findIndex(item => item.id === final.id)
      if (index < 0) draft.content.unshift(final); else draft.content[index] = final
      addActivity(draft, user.name, `${index < 0 ? 'Created' : 'Edited'} ${final.section.toLowerCase()} item`, final.title)
    }, status === 'Draft' ? 'Content saved as draft.' : 'Content saved.')
    setContentDraft(null)
  }
  const setContentStatus = (item: ContentItem, status: ContentStatus) => {
    if (!canManageContent) return
    if (status === 'Published' && ![item.category, item.office, item.body, item.source].every(value => value.trim())) { setContentDraft({ ...item }); setToast('Complete the verification fields before publishing.'); return }
    const verb = status === 'Published' ? 'Publish' : status === 'Archived' ? 'Archive' : item.status === 'Archived' ? 'Restore' : 'Unpublish'
    ask(`${verb} ${item.title}?`,
      status === 'Published' ? 'Authorized staff confirm this information is verified for the pilot.' : status === 'Archived' ? 'The item will be hidden from active records until restored.' : item.status === 'Archived' ? 'The item will return as an unpublished draft.' : 'This item will no longer appear as published citizen content.',
      status === 'Published' ? 'Confirm publish' : 'Confirm change', () => {
        change(draft => {
          const target = draft.content.find(entry => entry.id === item.id)!
          target.status = status; target.updatedAt = new Date().toISOString(); target.updatedBy = user.name
          if (status === 'Published') { target.reviewedAt = formatDate(target.updatedAt); target.publishedAt = target.publishedAt || target.updatedAt }
          addActivity(draft, user.name, `${verb} ${target.title}`, target.id)
        }, status === 'Published' ? 'Content published.' : 'Content status updated.')
      })
  }
  const newContent = (section: ContentSection) => setContentDraft({
    id: `demo-${Date.now()}`, section, title: '', category: '', office: '', body: '', status: 'Draft', location: '', contact: '', hours: '',
    source: '', requirements: '', procedure: '', processing: '', expiresAt: '', reviewedAt: '', updatedBy: user.name, updatedAt: new Date().toISOString(),
  })
  const saveRule = () => {
    if (!ruleDraft?.category.trim() || !ruleDraft.office || !canManageContent) return
    change(draft => {
      const final = { ...ruleDraft, reviewedAt: formatDate(new Date().toISOString()) }
      const index = draft.rules.findIndex(rule => rule.id === final.id)
      if (index < 0) draft.rules.push(final); else draft.rules[index] = final
      addActivity(draft, user.name, 'Updated suggested routing rule', final.category)
    }, 'Routing suggestion saved.')
    setRuleDraft(null)
  }
  const saveUser = () => {
    if (!userDraft?.name.trim() || !canManageUsers) return
    change(draft => {
      const index = draft.users.findIndex(item => item.id === userDraft.id)
      if (index < 0) draft.users.push(userDraft); else draft.users[index] = userDraft
      addActivity(draft, user.name, 'Updated prototype user', userDraft.name)
    }, 'Prototype user saved.')
    setUserDraft(null)
  }

  const pageHeading = (title: string, subtitle: string, actions?: ReactNode) => <div className="adm-page-heading">
    <div><h1>{title}</h1><p>{subtitle}</p></div>{actions && <div className="adm-heading-actions">{actions}</div>}
  </div>

  const renderOverview = () => {
    const statusRows = STATUSES.map(label => ({ label, value: overviewTickets.filter(item => item.status === label).length }))
    const categoryRows = unique(overviewTickets.map(item => item.category)).map(label => ({ label, value: overviewTickets.filter(item => item.category === label).length })).sort((a, b) => b.value - a.value).slice(0, 6)
    const barangays = unique(overviewTickets.map(item => item.barangay)).map(label => ({ label, value: overviewTickets.filter(item => item.barangay === label).length })).sort((a, b) => b.value - a.value)
    return <>
      {pageHeading('Overview', 'LibON Pilot Operations', <>
        <select aria-label="Date range" value={overviewRange} onChange={event => setOverviewRange(event.target.value)}><option value="all">All pilot data</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
        <select aria-label="Office" value={overviewOffice} onChange={event => setOverviewOffice(event.target.value)}><option value="all">All offices</option>{OFFICES.map(office => <option key={office}>{office}</option>)}</select>
        <button className="adm-btn" onClick={refresh}><ArrowPathIcon /> Refresh</button>
      </>)}
      <div className="adm-metrics">
        {[
          ['Total Pilot Tickets', overviewTickets.length, 'Reports in selected range'],
          ['Active Tickets', overviewTickets.filter(item => item.status !== 'Resolved').length, 'Currently open'],
          ['Resolved Tickets', overviewTickets.filter(item => item.status === 'Resolved').length, 'Verified as resolved'],
          ['Awaiting Action', overviewTickets.filter(item => ['Submitted', 'Received'].includes(item.status)).length, 'Submitted or received'],
        ].map(([label, value, detail]) => <div className="adm-metric" key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}
      </div>
      <div className="adm-grid-two">
        <Panel title="Status Distribution" action={<span className="adm-subtle">Exact ticket workflow</span>}><Bars rows={statusRows} /></Panel>
        <Panel title="Top Concern Categories" action={<span className="adm-subtle">Demo reports</span>}><Bars rows={categoryRows} /></Panel>
      </div>
      <div className="adm-grid-two adm-grid-activity">
        <Panel title="Recent Activity" action={<button className="adm-text-btn" onClick={() => navigate('/admin/activity')}>View log <ChevronRightIcon /></button>}>
          <div className="adm-activity-list">{activity.map(item => <div key={item.id} className="adm-activity-row"><span className="adm-activity-dot" /><div><strong>{item.action}</strong><small>{item.record} · {item.actor}</small></div><time>{displayDate(item.at)}</time></div>)}</div>
        </Panel>
        <Panel title="Barangay Summary" action={<span className="adm-subtle">Fictional location data</span>}>
          <table className="adm-table"><thead><tr><th>Barangay</th><th>Tickets</th></tr></thead><tbody>{barangays.map(row => <tr key={row.label}><td>{row.label}</td><td>{row.value}</td></tr>)}</tbody></table>
        </Panel>
      </div>
    </>
  }

  const renderQueue = () => {
    const maxPage = Math.max(1, Math.ceil(queue.length / 8))
    const currentPage = Math.min(page, maxPage)
    const shown = queue.slice((currentPage - 1) * 8, currentPage * 8)
    return <>
      {pageHeading('Ticket Queue', 'Review, assign, and track citizen reports.', <a className="adm-btn" href={csvDataUrl(ticketCsvRows(queue))} download="libon-ticket-queue.csv"><ArrowDownTrayIcon /> Export current view</a>)}
      <Panel title={`${queue.length} tickets`} action={<span className="adm-subtle">Fictional pilot reports</span>} className="adm-queue-panel">
        <div className="adm-toolbar">
          <label className="adm-search"><MagnifyingGlassIcon /><input placeholder="Search tickets..." value={ticketSearch} onChange={event => { setTicketSearch(event.target.value); setPage(1) }} aria-label="Search tickets" /></label>
          <select aria-label="Status filter" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); setPage(1) }}><option value="all">All statuses</option>{STATUSES.map(status => <option key={status}>{status}</option>)}</select>
          <select aria-label="Category filter" value={categoryFilter} onChange={event => { setCategoryFilter(event.target.value); setPage(1) }}><option value="all">All categories</option>{unique(visibleTickets.map(item => item.category)).map(category => <option key={category}>{category}</option>)}</select>
          <select aria-label="Assigned office filter" value={officeFilter} onChange={event => { setOfficeFilter(event.target.value); setPage(1) }}><option value="all">All offices</option><option>Unassigned</option>{OFFICES.map(office => <option key={office}>{office}</option>)}</select>
          <select aria-label="Date range filter" value={dateFilter} onChange={event => { setDateFilter(event.target.value); setPage(1) }}><option value="all">All dates</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
          <select aria-label="Sort tickets" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="status">By status</option><option value="category">By category</option></select>
          <button className="adm-text-btn" onClick={clearQueueFilters}><FunnelIcon /> Clear filters</button>
        </div>
        <div className="adm-table-scroll"><table className="adm-table adm-ticket-table"><thead><tr><th>Ticket ID</th><th>Category</th><th>Date Submitted</th><th>Status</th><th>Location</th><th>Assigned Office</th><th>Last Updated</th><th>Action</th></tr></thead>
          <tbody>{shown.map(item => <tr key={item.id} onClick={() => navigate(`/admin/tickets/${item.id}`)}>
            <td className="adm-id">{item.id}</td><td>{item.category}</td><td>{formatDate(item.submittedAt)}</td><td><StatusBadge value={item.status} /></td>
            <td>{item.barangay}</td><td>{item.office || 'Unassigned'}</td><td>{formatDate(item.updatedAt)}</td>
            <td><button className="adm-row-action" onClick={event => { event.stopPropagation(); navigate(`/admin/tickets/${item.id}`) }}>View <ChevronRightIcon /></button></td>
          </tr>)}</tbody></table></div>
        {!shown.length && <Empty title="No tickets match these filters." detail="Try changing the search or filters." />}
        <div className="adm-table-foot"><span>Showing {shown.length ? (currentPage - 1) * 8 + 1 : 0}–{Math.min(currentPage * 8, queue.length)} of {queue.length}</span><div><button className="adm-icon-btn" disabled={currentPage <= 1} aria-label="Previous page" onClick={() => setPage(currentPage - 1)}><ChevronLeftIcon /></button><span>Page {currentPage} of {maxPage}</span><button className="adm-icon-btn" disabled={currentPage >= maxPage} aria-label="Next page" onClick={() => setPage(currentPage + 1)}><ChevronRightIcon /></button></div></div>
      </Panel>
    </>
  }

  const renderTicketDetail = () => {
    if (!ticket) return <><button className="adm-back" onClick={() => navigate('/admin/tickets')}><ArrowLeftIcon /> Ticket Queue</button><Empty title="Ticket not found." detail="The requested demo ticket is unavailable." /></>
    const mayEdit = canManageTickets && (user.role !== 'Office Focal Person' || ticket.office === user.office)
    return <>
      <button className="adm-back" onClick={() => navigate('/admin/tickets')}><ArrowLeftIcon /> Ticket Queue</button>
      {pageHeading(`Ticket ${ticket.id}`, 'Citizen report review and authorized municipal action.', <button className="adm-btn" onClick={() => navigate(`/admin/tickets/${ticket.id}/record`)}><DocumentTextIcon /> Structured ticket · F6</button>)}
      <div className="adm-ticket-summary"><div><span>Category</span><strong>{ticket.category}</strong></div><div><span>Current Status</span><StatusBadge value={ticket.status} /></div><div><span>Submitted</span><strong>{displayDate(ticket.submittedAt)}</strong></div><div><span>Assigned Office</span><strong>{ticket.office || 'Unassigned'}</strong></div></div>
      <div className="adm-detail-grid"><div className="adm-detail-main">
        <Panel title="Original Resident Message"><blockquote className="adm-original">“{ticket.message}”</blockquote><p className="adm-caption">Kept separate from the system-prepared summary.</p></Panel>
        <Panel title="Structured Summary" action={<span className="adm-tag">AI-assisted · staff review required</span>}>
          <dl className="adm-definition"><div><dt>Issue Type</dt><dd>{ticket.issueType}</dd></div><div><dt>Resident Need</dt><dd>{ticket.residentNeed}</dd></div><div><dt>Safety Context</dt><dd>{ticket.safetyContext}</dd></div><div className="full"><dt>Prepared Summary</dt><dd>{ticket.summary}</dd></div></dl>
        </Panel>
        <div className="adm-grid-two adm-evidence-grid">
          <Panel title="Image Evidence">{ticket.evidence ? <><EvidencePreview label={ticket.evidence.label} category={ticket.category} /><div className="adm-key-value"><span>Capture timestamp</span><strong>{displayDate(ticket.evidence.capturedAt)}</strong></div><div className="adm-key-value"><span>Source</span><strong>Captured through LibON · illustrative demo</strong></div></> : <Empty title="No image attached" detail="This report was submitted without photo evidence." />}</Panel>
          <Panel title="Confirmed Location"><div className="adm-location"><strong>{ticket.location}</strong><span>Resident-confirmed location</span></div><div className="adm-key-value"><span>Device-reported coordinates</span><strong>{ticket.coordinates}</strong></div><div className="adm-key-value"><span>Approx. accuracy</span><strong>{ticket.accuracy}</strong></div></Panel>
        </div>
        <Panel title="Status History"><div className="adm-history">{ticket.history.map((entry, index) => <div key={`${entry.at}-${index}`} className="adm-history-row"><i /><div><div><strong>{entry.status}</strong><time>{displayDate(entry.at)}</time></div><p>{entry.note}</p><small>{entry.actor}</small></div></div>)}</div></Panel>
        <Panel title="Internal Notes" action={<span className="adm-tag">Internal only · hidden from citizens</span>}>
          {ticket.notes.length ? <div className="adm-note-list">{ticket.notes.map(note => <div key={note.id}><p>{note.text}</p><small>{note.actor} · {displayDate(note.at)}</small></div>)}</div> : <p className="adm-muted">No internal notes yet.</p>}
          {mayEdit && <div className="adm-note-compose"><textarea placeholder="Add a note for authorized staff only" value={internalNote} onChange={event => setInternalNote(event.target.value)} /><button className="adm-btn" disabled={!internalNote.trim()} onClick={addInternalNote}>Add internal note</button></div>}
        </Panel>
      </div><aside className="adm-detail-side">
        <Panel title="Suggested Route" action={<span className="adm-tag">System suggestion</span>}><strong className="adm-route-office">{ticket.suggestedOffice}</strong><p className="adm-muted">Illustrative routing option. Staff confirm or change the assignment.</p></Panel>
        <Panel title="Assignment Control"><div className="adm-stack"><Field label="Assign Office"><select disabled={!mayEdit} value={assignOffice} onChange={event => setAssignOffice(event.target.value)}>{OFFICES.map(office => <option key={office}>{office}</option>)}</select></Field><Field label="Focal Person / Unit"><input disabled={!mayEdit} value={focal} onChange={event => setFocal(event.target.value)} placeholder="Optional focal unit" /></Field><button className="adm-btn adm-btn-primary" disabled={!mayEdit} onClick={assignTicket}>{ticket.office ? 'Confirm / Reassign' : 'Assign Ticket'}</button></div></Panel>
        <Panel title="Status Management"><div className="adm-stack"><Field label="Move to status"><select disabled={!mayEdit || ticket.status === 'Resolved'} value={statusChoice} onChange={event => setStatusChoice(event.target.value as TicketStatus | '')}><option value="">Choose next status</option>{STATUSES.filter(status => STATUSES.indexOf(status) === STATUSES.indexOf(ticket.status) + 1).map(status => <option key={status}>{status}</option>)}</select></Field><Field label={statusChoice === 'Resolved' ? 'Public resolution note (required)' : 'Public status note'}><textarea disabled={!mayEdit} value={publicNote} onChange={event => setPublicNote(event.target.value)} placeholder="Visible in citizen tracking" /></Field><div className="adm-button-stack"><button className="adm-btn adm-btn-primary" disabled={!mayEdit || !statusChoice || (statusChoice === 'Resolved' && !publicNote.trim())} onClick={updateStatus}>Confirm status change</button><button className="adm-btn" disabled={!mayEdit || !publicNote.trim()} onClick={addPublicNote}>Post note only</button></div></div></Panel>
        <div className="adm-authority"><ShieldCheckIcon /><p>Final verification, routing, official response, and resolution are performed by authorized LGU personnel.</p></div>
      </aside></div>
    </>
  }

  const renderRecord = () => {
    if (!ticket) return <Empty title="Ticket not found." />
    return <div className="adm-record-page"><div className="adm-record-actions"><button className="adm-back" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}><ArrowLeftIcon /> Ticket Detail</button><button className="adm-btn" onClick={() => window.print()}><PrinterIcon /> Print / Save PDF</button></div>
      <article className="adm-record"><div className="adm-record-head"><div><span>MUNICIPALITY OF LIBON · LIBON PILOT</span><h1>Structured Municipal Ticket</h1><p>Administrative demonstration record · Annex F6</p></div><img src={logo} alt="LibON" /></div>
        <div className="adm-record-meta"><div><span>Ticket Number</span><strong>{ticket.id}</strong></div><div><span>Submission Timestamp</span><strong>{displayDate(ticket.submittedAt)}</strong></div><div><span>Category</span><strong>{ticket.category}</strong></div><div><span>Current Status</span><strong>{ticket.status}</strong></div></div>
        <section><h2>Original Resident Message</h2><p>“{ticket.message}”</p></section>
        <section><h2>System-prepared Structured Summary</h2><p>{ticket.summary}</p><div className="adm-record-fields"><div><b>Issue Type</b>{ticket.issueType}</div><div><b>Resident Need</b>{ticket.residentNeed}</div><div><b>Safety Context</b>{ticket.safetyContext}</div></div></section>
        <div className="adm-record-split"><section><h2>Evidence</h2>{ticket.evidence ? <><EvidencePreview label={ticket.evidence.label} category={ticket.category} /><small>Captured through LibON · {displayDate(ticket.evidence.capturedAt)}</small></> : <p>No image attached.</p>}</section><section><h2>Location & Routing</h2><dl><dt>Confirmed Location</dt><dd>{ticket.location}</dd><dt>Device-reported Coordinates</dt><dd>{ticket.coordinates}</dd><dt>Suggested Route</dt><dd>{ticket.suggestedOffice}</dd><dt>Assigned Office</dt><dd>{ticket.office || 'Unassigned'}</dd><dt>Assigned Focal Unit</dt><dd>{ticket.focal || 'Unassigned'}</dd></dl></section></div>
        <section><h2>Status History</h2><table><thead><tr><th>Status</th><th>Timestamp</th><th>Actor / Office</th><th>Public Note</th></tr></thead><tbody>{ticket.history.map((entry, index) => <tr key={index}><td>{entry.status}</td><td>{displayDate(entry.at)}</td><td>{entry.actor}</td><td>{entry.note}</td></tr>)}</tbody></table></section>
        <footer>All resident, ticket, location, and operational data shown are fictional prototype data for demonstration purposes only.</footer>
      </article></div>
  }

  const renderContent = () => {
    const records = data.content.filter(item => item.section === contentSection && (showArchived || item.status !== 'Archived'))
    return <>
      {pageHeading('Content Management', 'Verify and maintain information shown in the citizen experience.', canManageContent && <button className="adm-btn adm-btn-primary" onClick={() => newContent(contentSection)}><PlusIcon /> New {contentSection === 'Knowledge Base' ? 'item' : 'entry'}</button>)}
      <div className="adm-content-tabs" role="tablist" aria-label="Content sections">{CONTENT_SECTIONS.map(section => <button key={section} role="tab" aria-selected={contentSection === section} className={contentSection === section ? 'active' : ''} onClick={() => navigate(`/admin/content/${sectionSlug(section)}`)}>{section}<span>{data.content.filter(item => item.section === section && item.status !== 'Archived').length}</span></button>)}</div>
      <div className="adm-content-summary">{(['Draft', 'Pending Verification', 'Published', 'Needs Review'] as ContentStatus[]).map(status => <div key={status}><strong>{records.filter(item => item.status === status).length}</strong><span>{status}</span></div>)}</div>
      <Panel title={`${contentSection} records`} action={<button className="adm-text-btn" onClick={() => setShowArchived(!showArchived)}>{showArchived ? 'Hide archived' : 'Show archived'}</button>}>
        <div className="adm-table-scroll"><table className="adm-table"><thead><tr><th>Name / Title</th><th>Category</th><th>Responsible Office</th><th>Verification Status</th><th>Last Reviewed</th><th>Updated By</th><th>Actions</th></tr></thead><tbody>{records.map(item => <tr key={item.id}><td className="adm-strong-cell">{item.title}</td><td>{item.category || '—'}</td><td>{item.office || '—'}</td><td><StatusBadge value={item.status} /></td><td>{item.reviewedAt || 'Not reviewed'}</td><td>{item.updatedBy || '—'}</td><td><div className="adm-row-actions"><button onClick={() => setPreviewItem(item)}><EyeIcon /> Preview</button>{canManageContent && <><button onClick={() => setContentDraft({ ...item })}><PencilSquareIcon /> Edit</button>{item.status === 'Archived' ? <button onClick={() => setContentStatus(item, 'Draft')}>Restore draft</button> : item.status === 'Published' ? <button onClick={() => setContentStatus(item, 'Draft')}>Unpublish</button> : <button onClick={() => setContentStatus(item, 'Published')}>{contentSection === 'Knowledge Base' ? 'Verify' : 'Publish'}</button>}{contentSection === 'Knowledge Base' && item.status !== 'Archived' && <button onClick={() => setContentStatus(item, 'Archived')}>Archive</button>}</>}</div></td></tr>)}</tbody></table></div>
        {!records.length && <Empty title="No entries available." detail="Create a draft to start this content section." />}
      </Panel>
      <p className="adm-footnote">Only staff-verified published knowledge is available to Talk to Libon. Explore listings have no paid ranking or sponsorship controls.</p>
    </>
  }

  const renderKnowledge = () => {
    const knowledge = data.content.filter(item => item.section === 'Knowledge Base' && item.status !== 'Archived')
    const unverified = knowledge.filter(item => item.status !== 'Published')
    return <>
      {pageHeading('Knowledge & Routing', 'Review verified sources and suggested destinations for citizen requests.', canManageContent && <button className="adm-btn adm-btn-primary" onClick={() => setRuleDraft({ id: `r${Date.now()}`, category: '', required: '', office: OFFICES[0], reviewedAt: '' })}><PlusIcon /> Add routing rule</button>)}
      <div className="adm-knowledge-stats"><div><strong>{knowledge.filter(item => item.status === 'Published').length}</strong><span>Verified knowledge sources</span></div><div><strong>{unverified.length}</strong><span>Awaiting review</span></div><div><strong>{data.rules.length}</strong><span>Suggested routing rules</span></div></div>
      <div className="adm-grid-two adm-knowledge-top"><Panel title="Knowledge Base Status" action={<button className="adm-text-btn" onClick={() => navigate('/admin/content/knowledge-base')}>Manage sources <ChevronRightIcon /></button>}>
        <div className="adm-knowledge-list">{knowledge.map(item => <div key={item.id}><div><strong>{item.title}</strong><small>{item.category} · {item.office}</small></div><StatusBadge value={item.status} /></div>)}</div>
      </Panel><Panel title="Unverified Items"><div className="adm-knowledge-list">{unverified.length ? unverified.map(item => <div key={item.id}><div><strong>{item.title}</strong><small>Last reviewed: {item.reviewedAt || 'Not yet reviewed'}</small></div><button className="adm-text-btn" onClick={() => navigate('/admin/content/knowledge-base')}>Review</button></div>) : <Empty title="No items awaiting verification." />}</div></Panel></div>
      <Panel title="Suggested Routing Matrix" action={<span className="adm-tag">Human confirmation required</span>}><div className="adm-table-scroll"><table className="adm-table"><thead><tr><th>Concern Category</th><th>Required Information</th><th>Suggested Destination</th><th>Last Reviewed</th><th>Action</th></tr></thead><tbody>{data.rules.map(rule => <tr key={rule.id}><td className="adm-strong-cell">{rule.category}</td><td>{rule.required}</td><td>{rule.office}</td><td>{rule.reviewedAt}</td><td>{canManageContent ? <button className="adm-row-action" onClick={() => setRuleDraft({ ...rule })}><PencilSquareIcon /> Edit</button> : 'View only'}</td></tr>)}</tbody></table></div></Panel>
      <div className="adm-authority adm-routing-notice"><ShieldCheckIcon /><p>Final routing rules must be validated with participating municipal offices during pilot preparation. System suggestions do not assign tickets automatically.</p></div>
    </>
  }

  const renderAnalytics = () => {
    const months = unique(analyticsTickets.flatMap(item => [item.submittedAt.slice(0, 7), ...item.history.filter(entry => entry.status === 'Resolved').map(entry => entry.at.slice(0, 7))]))
    const monthly = months.map(month => ({ month, submitted: analyticsTickets.filter(item => item.submittedAt.startsWith(month)).length, resolved: analyticsTickets.filter(item => item.history.some(entry => entry.status === 'Resolved' && entry.at.startsWith(month))).length }))
    const categoryRows = unique(analyticsTickets.map(item => item.category)).map(label => ({ label, value: analyticsTickets.filter(item => item.category === label).length })).sort((a, b) => b.value - a.value)
    const accepted = analyticsTickets.filter(item => item.office && item.routingAccepted).length
    const routed = analyticsTickets.filter(item => item.office).length
    const acknowledged = analyticsTickets.filter(item => item.history.some(entry => entry.status !== 'Submitted')).length
    const complete = analyticsTickets.filter(item => item.requiredComplete).length
    const verifiedServices = data.content.filter(item => item.section === 'Services' && item.status === 'Published').length
    const services = data.content.filter(item => item.section === 'Services' && item.status !== 'Archived').length
    const summaryCsv = csvDataUrl([
      ['Indicator', 'Demo Value'], ['Tickets in selected filters', analyticsTickets.length], ['Routing suggestions accepted without reassignment', `${numberPercent(accepted, routed)}%`],
      ['Tickets with acknowledgment / status update', `${numberPercent(acknowledged, analyticsTickets.length)}%`], ['Reports with required information complete', `${numberPercent(complete, analyticsTickets.length)}%`],
      ...monthly.map(row => [`${row.month} submitted`, row.submitted]), ...monthly.map(row => [`${row.month} resolved`, row.resolved]),
    ])
    return <>
      {pageHeading('Pilot Analytics', 'Operational indicators for the LibON pilot.', <><a className="adm-btn" href={csvDataUrl(ticketCsvRows(analyticsTickets))} download="libon-pilot-analytics-tickets.csv"><ArrowDownTrayIcon /> Export CSV</a><a className="adm-btn" href={summaryCsv} download="libon-pilot-analytics-summary.csv"><ArrowDownTrayIcon /> Export Summary</a></>)}
      <div className="adm-filter-strip"><Field label="Date Range"><select value={analyticsRange} onChange={event => setAnalyticsRange(event.target.value)}><option value="all">All pilot data</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></Field><Field label="Office"><select value={analyticsOffice} onChange={event => setAnalyticsOffice(event.target.value)}><option value="all">All offices</option>{OFFICES.map(office => <option key={office}>{office}</option>)}</select></Field><Field label="Category"><select value={analyticsCategory} onChange={event => setAnalyticsCategory(event.target.value)}><option value="all">All categories</option>{unique(data.tickets.map(item => item.category)).map(category => <option key={category}>{category}</option>)}</select></Field><a className="adm-btn" href={csvDataUrl(ticketCsvRows(analyticsTickets))} download="libon-pilot-date-range.csv">Date range export</a></div>
      <div className="adm-grid-two"><Panel title="Monthly Ticket Trend" action={<span className="adm-subtle">Submitted / resolved</span>}>
        {monthly.length ? <div className="adm-trend"><div className="adm-trend-legend"><span><i /> Submitted</span><span><i /> Resolved</span></div>{monthly.map(row => <div className="adm-trend-row" key={row.month}><span>{new Intl.DateTimeFormat('en-PH', { month: 'short', year: 'numeric' }).format(new Date(`${row.month}-01T00:00:00`))}</span><div><i style={{ width: `${row.submitted / Math.max(1, ...monthly.map(item => item.submitted)) * 100}%` }} /><i style={{ width: `${row.resolved / Math.max(1, ...monthly.map(item => item.submitted)) * 100}%` }} /></div><strong>{row.submitted} / {row.resolved}</strong></div>)}</div> : <Empty title="No tickets in this date range." />}
      </Panel><Panel title="Concern Category Distribution"><Bars rows={categoryRows} /></Panel></div>
      <div className="adm-indicator-grid"><div><span>Routing Suggestions Accepted Without Reassignment</span><strong>{numberPercent(accepted, routed)}%</strong><small>{accepted} accepted · {routed - accepted} reassigned</small></div><div><span>Response Status Visibility</span><strong>{numberPercent(acknowledged, analyticsTickets.length)}%</strong><small>Acknowledgment or status update logged. Office timing standards await pilot validation.</small></div><div><span>Reports With Required Information Complete</span><strong>{numberPercent(complete, analyticsTickets.length)}%</strong><small>{complete} complete · {analyticsTickets.length - complete} missing required fields</small></div></div>
      <Panel title="Pilot Indicator Summary" action={<span className="adm-tag">Demo pilot data · not actual results</span>}><div className="adm-indicator-list">
        {[
          ['Pilot service information verified', `${numberPercent(verifiedServices, services)}%`], ['Core-task usability', 'Not measured'],
          ['Report completeness', `${numberPercent(complete, analyticsTickets.length)}%`], ['Routing acceptance', `${numberPercent(accepted, routed)}%`],
          ['Response visibility', `${numberPercent(acknowledged, analyticsTickets.length)}%`], ['AI municipal knowledge accuracy', 'Not measured'],
          ['User usefulness / satisfaction', 'Not measured'], ['Privacy/security incidents', '0 logged in demo'],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div></Panel>
    </>
  }

  const renderUsers = () => <>
    {pageHeading('Users & Activity', 'Fictional authorized accounts and prototype role restrictions.', canManageUsers && <button className="adm-btn adm-btn-primary" onClick={() => setUserDraft({ id: `user-${Date.now()}`, name: '', role: 'Read-only Monitoring User', office: '', status: 'Active', lastActive: new Date().toISOString() })}><PlusIcon /> Add user</button>)}
    <Panel title="Authorized Users" action={<span className="adm-subtle">Role switch is for demonstration only</span>}><div className="adm-table-scroll"><table className="adm-table"><thead><tr><th>Name</th><th>Role</th><th>Office</th><th>Status</th><th>Last Active</th><th>Action</th></tr></thead><tbody>{data.users.map(item => <tr key={item.id}><td className="adm-strong-cell">{item.name}{item.id === user.id && <span className="adm-current">Current</span>}</td><td>{item.role}</td><td>{item.office}</td><td><StatusBadge value={item.status} /></td><td>{displayDate(item.lastActive)}</td><td><div className="adm-row-actions"><button disabled={item.status === 'Inactive'} onClick={() => change(draft => { draft.activeUserId = item.id }, `Viewing as ${item.role}.`)}>Use role</button>{canManageUsers && <button onClick={() => setUserDraft({ ...item })}><PencilSquareIcon /> Edit</button>}</div></td></tr>)}</tbody></table></div></Panel>
    <div className="adm-grid-two"><Panel title="Prototype Role Access"><div className="adm-role-list"><div><strong>System Administrator</strong><span>Users, all tickets, content, analytics</span></div><div><strong>Office Focal Person</strong><span>Assigned office tickets, status, notes</span></div><div><strong>Content Manager</strong><span>Services, Explore, Updates, Help, Knowledge</span></div><div><strong>Read-only Monitoring User</strong><span>View tickets and analytics; no record changes</span></div></div></Panel><Panel title="Recent Audit Activity" action={<button className="adm-text-btn" onClick={() => navigate('/admin/activity')}>Full activity log <ChevronRightIcon /></button>}><div className="adm-activity-list">{activity.map(item => <div className="adm-activity-row" key={item.id}><span className="adm-activity-dot" /><div><strong>{item.action}</strong><small>{item.actor} · {item.record}</small></div><time>{displayDate(item.at)}</time></div>)}</div></Panel></div>
    <p className="adm-footnote">These roles are illustrative for the pilot and may change after LGU validation. Switching role here simulates permissions; this prototype does not provide production authentication.</p>
  </>
  const renderActivity = () => <>
    {pageHeading('Activity Log', 'Audit trail for significant prototype actions.', <a className="adm-btn" href={csvDataUrl([['Time', 'User', 'Action', 'Record'], ...data.activity.map(item => [displayDate(item.at), item.actor, item.action, item.record])])} download="libon-activity-log.csv"><ArrowDownTrayIcon /> Export log</a>)}
    <Panel title={`${data.activity.length} recorded actions`}><div className="adm-table-scroll"><table className="adm-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Record</th></tr></thead><tbody>{data.activity.map(item => <tr key={item.id}><td>{displayDate(item.at)}</td><td>{item.actor}</td><td>{item.action}</td><td className="adm-id">{item.record}</td></tr>)}</tbody></table></div></Panel>
  </>
  const renderSettings = () => <>
    {pageHeading('Settings', 'Prototype workspace and local demo data.')}
    <Panel title="Demo data storage"><p className="adm-settings-text">Tickets, content, routing rules, users, and activity are stored in this browser for the documentation prototype. No production municipal backend is connected.</p><div className="adm-settings-actions"><a className="adm-btn" href={csvDataUrl(ticketCsvRows(data.tickets))} download="libon-all-tickets.csv"><ArrowDownTrayIcon /> Export all tickets</a><button className="adm-btn" onClick={refresh}><ArrowPathIcon /> Reload local data</button><button className="adm-btn" onClick={() => ask('Reset demo data?', 'All edits and newly submitted demo tickets in this browser will be replaced with the original fictional seed data.', 'Reset demo', () => { resetDemoStore(); setToast('Demo data reset.') })}>Reset demo</button></div></Panel>
  </>

  const navTitle = route.startsWith('/admin/tickets') ? 'Tickets' : route.startsWith('/admin/content') ? 'Content' : route.startsWith('/admin/knowledge') ? 'Knowledge & Routing' : route.startsWith('/admin/analytics') ? 'Analytics' : route.startsWith('/admin/users') || route.startsWith('/admin/activity') ? 'Users & Activity' : route.startsWith('/admin/settings') ? 'Settings' : 'Overview'
  const currentNav = route.startsWith('/admin/tickets') ? '/admin/tickets' : route.startsWith('/admin/content') ? '/admin/content' : route.startsWith('/admin/knowledge') ? '/admin/knowledge' : route.startsWith('/admin/analytics') ? '/admin/analytics' : route.startsWith('/admin/users') || route.startsWith('/admin/activity') ? '/admin/users' : route.startsWith('/admin/settings') ? '/admin/settings' : '/admin'
  const body = recordMode ? renderRecord() : ticketId ? renderTicketDetail() : route.startsWith('/admin/tickets') ? renderQueue()
    : route.startsWith('/admin/content') ? renderContent() : route.startsWith('/admin/knowledge') ? renderKnowledge()
    : route.startsWith('/admin/analytics') ? renderAnalytics() : route.startsWith('/admin/users') ? renderUsers()
    : route.startsWith('/admin/activity') ? renderActivity() : route.startsWith('/admin/settings') ? renderSettings() : renderOverview()

  if (signedOut) return <div className="admin-root adm-signout"><div><img src={logo} alt="LibON" /><h1>LibON Pilot Administration</h1><p>You have left the local demonstration workspace.</p><button className="adm-btn adm-btn-primary" onClick={() => setSignedOut(false)}>Enter demo workspace</button><button className="adm-text-btn" onClick={() => navigate('/')}>Citizen view</button></div></div>

  return <div className="admin-root">
    <aside className={`adm-sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="adm-brand"><span className="adm-brand-logo"><img src={logo} alt="LibON" /></span><div><strong>LibON</strong><span>Pilot Administration</span></div></div>
      <div className="adm-side-section">WORKSPACE</div>
      <nav aria-label="Administration">{NAV.map(item => <button key={item.path} aria-label={item.label} className={currentNav === item.path ? 'active' : ''} onClick={() => navigate(item.path)}><item.icon /><span>{item.label}</span></button>)}</nav>
      <div className="adm-sidebar-bottom"><button className={currentNav === '/admin/settings' ? 'active' : ''} onClick={() => navigate('/admin/settings')}><Cog6ToothIcon /><span>Settings</span></button><div className="adm-side-profile"><span className="adm-profile-avatar"><UserIcon aria-hidden="true" /></span><div><strong>{user.name}</strong><small>{user.role}</small></div></div><button onClick={() => setSignedOut(true)}><ArrowRightOnRectangleIcon /><span>Logout</span></button></div>
    </aside>
    <div className="adm-workspace"><header className="adm-topbar"><div className="adm-top-left"><button className="adm-icon-btn adm-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}><Bars3Icon /></button><div><strong>{navTitle}</strong><span>Municipality of Libon · LibON Pilot Administration</span></div></div>
      <div className="adm-top-actions"><form className="adm-global-search" onSubmit={(event: FormEvent) => { event.preventDefault(); navigate(`/admin/tickets?q=${encodeURIComponent(globalSearch)}`); setGlobalSearch('') }}><MagnifyingGlassIcon /><input aria-label="Search dashboard tickets" placeholder="Search tickets" value={globalSearch} onChange={event => setGlobalSearch(event.target.value)} /></form>
        <div className="adm-notification-wrap"><button className="adm-icon-btn adm-notification-button" aria-label="Admin notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><BellIcon />{pendingCount > 0 && <i />}</button>{notificationsOpen && <div className="adm-notification-menu"><strong>Needs attention</strong><button onClick={() => navigate('/admin/tickets?status=Submitted')}>{data.tickets.filter(item => item.status === 'Submitted').length} newly submitted reports</button><button onClick={() => navigate('/admin/tickets?status=Received')}>{data.tickets.filter(item => item.status === 'Received').length} awaiting assignment</button><button onClick={() => navigate('/admin/content/knowledge-base')}>{data.content.filter(item => item.status === 'Pending Verification').length} content items awaiting verification</button></div>}</div>
        <div className="adm-top-user"><span className="adm-profile-avatar"><UserIcon aria-hidden="true" /></span><div><strong>{user.name}</strong><small>{user.role}</small></div></div>
        <button className="adm-view-switch" onClick={() => navigate('/')} title="Switch to citizen prototype">Citizen view <ChevronRightIcon /></button>
      </div></header>
      <main className="adm-main"><div className="adm-main-inner">
        {loading ? <section className="adm-panel adm-loading" aria-label="Loading dashboard data"><div className="adm-skeleton-title" />{Array.from({ length: 6 }, (_, index) => <div className="adm-skeleton-row" key={index}><i /><i /><i /><i /></div>)}</section>
          : hasDemoStoreError() ? <section className="adm-panel adm-load-error"><h1>Unable to load dashboard data.</h1><p>The saved local demo data could not be read.</p><div><button className="adm-btn adm-btn-primary" onClick={refresh}>Try Again</button><button className="adm-btn" onClick={() => ask('Reset unreadable demo data?', 'Replace unreadable local data with the original fictional seed data.', 'Reset demo', () => { resetDemoStore(); setToast('Demo data reset.') })}>Reset demo data</button></div></section>
          : body}
      </div></main>
    </div>
    {menuOpen && <button className="adm-menu-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    {toast && <div className="adm-toast" role="status"><CheckCircleIcon /> {toast}</div>}
    {confirm && <Modal title={confirm.title} onClose={() => setConfirm(null)} footer={<><button className="adm-btn" onClick={() => setConfirm(null)}>Cancel</button><button className="adm-btn adm-btn-primary" onClick={() => { confirm.run(); setConfirm(null) }}>{confirm.label}</button></>}><p>{confirm.body}</p></Modal>}
    {previewItem && <Modal title={`Preview · ${previewItem.title}`} onClose={() => setPreviewItem(null)} footer={<button className="adm-btn" onClick={() => setPreviewItem(null)}>Close preview</button>}><div className="adm-preview"><StatusBadge value={previewItem.status} /><h3>{previewItem.title}</h3>{previewItem.imageUrl && <img src={previewItem.imageUrl} alt="Illustrative content preview" />}<p>{previewItem.body}</p><dl><dt>Category</dt><dd>{previewItem.category || '—'}</dd><dt>Responsible Office</dt><dd>{previewItem.office || '—'}</dd><dt>Location</dt><dd>{previewItem.location || '—'}</dd><dt>Hours</dt><dd>{previewItem.hours || '—'}</dd><dt>Contact</dt><dd>{previewItem.contact || '—'}</dd><dt>Requirements</dt><dd>{previewItem.requirements || '—'}</dd><dt>Procedure</dt><dd>{previewItem.procedure || '—'}</dd><dt>Processing</dt><dd>{previewItem.processing || '—'}</dd><dt>Expiry</dt><dd>{previewItem.expiresAt || '—'}</dd><dt>Source</dt><dd>{previewItem.source || '—'}</dd></dl></div></Modal>}
    {contentDraft && <Modal title={`${data.content.some(item => item.id === contentDraft.id) ? 'Edit' : 'New'} ${contentDraft.section} entry`} onClose={() => setContentDraft(null)} footer={<><button className="adm-btn" onClick={() => setContentDraft(null)}>Cancel</button><button className="adm-btn" onClick={() => saveContent('Draft')}>Save Draft</button><button className="adm-btn adm-btn-primary" onClick={() => saveContent()}>Save Changes</button></>}><div className="adm-editor-grid">
      <Field label="Title / Name"><input value={contentDraft.title} onChange={event => setContentDraft({ ...contentDraft, title: event.target.value })} /></Field>
      <Field label="Category"><input value={contentDraft.category} onChange={event => setContentDraft({ ...contentDraft, category: event.target.value })} placeholder={contentDraft.section === 'Updates' ? 'Advisories, Programs, Opportunities, Events, Emergency' : 'Category'} /></Field>
      <Field label="Responsible / Publishing Office"><input value={contentDraft.office} onChange={event => setContentDraft({ ...contentDraft, office: event.target.value })} /></Field>
      <Field label="Verification Status"><select value={contentDraft.status} onChange={event => setContentDraft({ ...contentDraft, status: event.target.value as ContentStatus })}><option>Draft</option><option>Pending Verification</option>{data.content.some(item => item.id === contentDraft.id && item.status === 'Published') && <option>Published</option>}<option>Needs Review</option>{contentDraft.status === 'Archived' && <option>Archived</option>}</select></Field>
      <Field label="Description / Body"><textarea value={contentDraft.body} onChange={event => setContentDraft({ ...contentDraft, body: event.target.value })} /></Field>
      <Field label="Verification Source"><input value={contentDraft.source} onChange={event => setContentDraft({ ...contentDraft, source: event.target.value })} /></Field>
      {contentDraft.section === 'Services' && <>
        <Field label="External Official Link"><input type="url" value={contentDraft.officialLink || ''} onChange={event => setContentDraft({ ...contentDraft, officialLink: event.target.value })} placeholder="https://..." /></Field>
        <Field label="Requirements"><textarea value={contentDraft.requirements} onChange={event => setContentDraft({ ...contentDraft, requirements: event.target.value })} /></Field>
        <Field label="Procedure"><textarea value={contentDraft.procedure} onChange={event => setContentDraft({ ...contentDraft, procedure: event.target.value })} /></Field>
        <Field label="Processing Information"><input value={contentDraft.processing} onChange={event => setContentDraft({ ...contentDraft, processing: event.target.value })} /></Field>
      </>}
      {(contentDraft.section === 'Explore' || contentDraft.section === 'Updates') && <Field label="Image URL (optional)"><input type="url" value={contentDraft.imageUrl || ''} onChange={event => setContentDraft({ ...contentDraft, imageUrl: event.target.value })} placeholder="https://..." /></Field>}
      {['Services', 'Explore', 'Help'].includes(contentDraft.section) && <Field label="Location / Barangay"><input value={contentDraft.location} onChange={event => setContentDraft({ ...contentDraft, location: event.target.value })} /></Field>}
      {contentDraft.section !== 'Knowledge Base' && <Field label="Contact / Related Contact"><input value={contentDraft.contact} onChange={event => setContentDraft({ ...contentDraft, contact: event.target.value })} /></Field>}
      {['Services', 'Explore', 'Help'].includes(contentDraft.section) && <Field label="Office Hours"><input value={contentDraft.hours} onChange={event => setContentDraft({ ...contentDraft, hours: event.target.value })} /></Field>}
      {contentDraft.section === 'Updates' && <Field label="Expiry Date"><input type="date" value={contentDraft.expiresAt} onChange={event => setContentDraft({ ...contentDraft, expiresAt: event.target.value })} /></Field>}
      {contentDraft.section === 'Updates' && <Field label="Publication Date"><input type="date" value={contentDraft.publishedAt?.slice(0, 10) || ''} onChange={event => setContentDraft({ ...contentDraft, publishedAt: event.target.value })} /></Field>}
      <p className="adm-editor-note">Publishing requires the separate confirmation action in the content table. Draft edits remain local to this browser.</p>
    </div></Modal>}
    {ruleDraft && <Modal title="Suggested routing rule" onClose={() => setRuleDraft(null)} footer={<><button className="adm-btn" onClick={() => setRuleDraft(null)}>Cancel</button><button className="adm-btn adm-btn-primary" onClick={saveRule}>Save rule</button></>}><div className="adm-stack"><Field label="Concern Category"><input value={ruleDraft.category} onChange={event => setRuleDraft({ ...ruleDraft, category: event.target.value })} /></Field><Field label="Required Information"><input value={ruleDraft.required} onChange={event => setRuleDraft({ ...ruleDraft, required: event.target.value })} /></Field><Field label="Suggested Destination"><select value={ruleDraft.office} onChange={event => setRuleDraft({ ...ruleDraft, office: event.target.value })}>{OFFICES.map(office => <option key={office}>{office}</option>)}</select></Field></div></Modal>}
    {userDraft && <Modal title="Prototype user" onClose={() => setUserDraft(null)} footer={<><button className="adm-btn" onClick={() => setUserDraft(null)}>Cancel</button><button className="adm-btn adm-btn-primary" onClick={saveUser}>Save user</button></>}><div className="adm-stack"><Field label="Name"><input value={userDraft.name} onChange={event => setUserDraft({ ...userDraft, name: event.target.value })} /></Field><Field label="Role"><select value={userDraft.role} onChange={event => setUserDraft({ ...userDraft, role: event.target.value as AdminUser['role'] })}><option>System Administrator</option><option>Office Focal Person</option><option>Content Manager</option><option>Read-only Monitoring User</option></select></Field><Field label="Office"><input value={userDraft.office} onChange={event => setUserDraft({ ...userDraft, office: event.target.value })} /></Field><Field label="Status"><select value={userDraft.status} onChange={event => setUserDraft({ ...userDraft, status: event.target.value as AdminUser['status'] })}><option>Active</option><option>Inactive</option></select></Field></div></Modal>}
  </div>
}
