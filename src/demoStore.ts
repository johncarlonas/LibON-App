import { useSyncExternalStore } from 'react'

export const STATUSES = ['Submitted', 'Received', 'Assigned', 'Action Taken', 'Resolved'] as const
export type TicketStatus = typeof STATUSES[number]
export const OFFICES = ['Engineering / Maintenance', 'MDRRMO', 'Rural Health Unit', 'Environment / Sanitation', 'Tourism / Local Directory', 'General Municipal Assistance'] as const
export type Office = typeof OFFICES[number]
export const CONTENT_SECTIONS = ['Services', 'Explore', 'Updates', 'Help', 'Knowledge Base'] as const
export type ContentSection = typeof CONTENT_SECTIONS[number]
export type ContentStatus = 'Draft' | 'Pending Verification' | 'Published' | 'Needs Review' | 'Archived'
export type Role = 'System Administrator' | 'Office Focal Person' | 'Content Manager' | 'Read-only Monitoring User'

export type HistoryEntry = { status: TicketStatus; at: string; actor: string; note: string }
export type InternalNote = { id: string; at: string; actor: string; text: string }
export type Ticket = {
  id: string; category: string; message: string; issueType: string; residentNeed: string; safetyContext: string; summary: string
  location: string; barangay: string; coordinates: string; accuracy: string; submittedAt: string; updatedAt: string
  status: TicketStatus; office: string; focal: string; suggestedOffice: string; history: HistoryEntry[]; notes: InternalNote[]
  evidence?: { capturedAt: string; label: string }; citizenVisible: boolean; routingAccepted: boolean; requiredComplete: boolean
}
export type ContentItem = {
  id: string; section: ContentSection; title: string; category: string; office: string; body: string; status: ContentStatus
  location: string; contact: string; hours: string; source: string; requirements: string; procedure: string; processing: string
  expiresAt: string; reviewedAt: string; updatedBy: string; updatedAt: string
  imageUrl?: string; officialLink?: string; publishedAt?: string
}
export type RouteRule = { id: string; category: string; required: string; office: string; reviewedAt: string }
export type AdminUser = { id: string; name: string; role: Role; office: string; status: 'Active' | 'Inactive'; lastActive: string }
export type Activity = { id: string; at: string; actor: string; action: string; record: string }
export type DemoState = { tickets: Ticket[]; content: ContentItem[]; rules: RouteRule[]; users: AdminUser[]; activity: Activity[]; activeUserId: string }

const at = (day: number, hour = 9, month = 9) => `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:10:00+08:00`

function seedTicket(id: number, category: string, message: string, summary: string, barangay: string, status: TicketStatus, office: string, day: number, month = 9): Ticket {
  const submittedAt = at(day, 9, month)
  const step = STATUSES.indexOf(status)
  const history = STATUSES.slice(0, step + 1).map((entry, index): HistoryEntry => ({
    status: entry, at: at(day, 9 + index, month), actor: index ? 'Demo LGU Staff' : 'LibON Citizen',
    note: entry === 'Submitted' ? 'Report submitted through LibON.' : entry === 'Resolved' ? 'Concern addressed and verified by the assigned office.' : `${entry} by authorized LGU personnel.`,
  }))
  return {
    id: `LIB-2026-${String(id).padStart(4, '0')}`, category, message, issueType: category, residentNeed: 'Inspection and appropriate municipal response',
    safetyContext: category.includes('Streetlight') ? 'Poor nighttime visibility near a public area' : 'Resident-reported community concern',
    summary, location: `Near community area, Barangay ${barangay}, Libon, Albay`, barangay, coordinates: '13.2991° N, 123.4390° E', accuracy: 'Approx. 35 m (demo)',
    submittedAt, updatedAt: history.at(-1)?.at ?? submittedAt, status, office: step >= 2 ? office : '', focal: step >= 2 ? 'Office desk' : '',
    suggestedOffice: office, history, notes: [], citizenVisible: id === 132, routingAccepted: true, requiredComplete: id !== 133,
    ...(id === 147 ? { evidence: { capturedAt: at(day, 14, month), label: 'Illustrative streetlight evidence · demo only' } } : {}),
  }
}

const seededTickets: Ticket[] = [
  seedTicket(147, 'Streetlight / Electrical', 'Sira po ang streetlight malapit sa covered court. Madilim po sa gabi at delikado sa mga dumadaan.', 'Reported streetlight near the covered court is not functioning and may affect nighttime safety.', 'San Isidro', 'Assigned', OFFICES[0], 27),
  seedTicket(146, 'Drainage / Flooding', 'Bumabara po ang kanal sa tapat ng waiting shed tuwing umuulan.', 'Drainage near the waiting shed may require clearing and inspection.', 'Poblacion', 'Received', OFFICES[1], 27),
  seedTicket(145, 'Road / Sidewalk', 'May sira po sa sidewalk sa may palengke.', 'Damaged sidewalk near the market was reported for inspection.', 'Poblacion', 'Submitted', OFFICES[0], 26),
  seedTicket(144, 'Waste / Sanitation', 'Hindi pa po nakukuha ang basura sa kanto namin.', 'Waste collection concern reported near a residential corner.', 'Bulusan', 'Action Taken', OFFICES[3], 24),
  seedTicket(143, 'Public Facility', 'Hindi po gumagana ang ilaw sa waiting area.', 'Lighting issue in a public waiting area requires inspection.', 'Bariw', 'Resolved', OFFICES[0], 22),
  seedTicket(142, 'Environmental Concern', 'May natumbang puno sa gilid ng kalsada.', 'Fallen tree along the road needs safe clearing.', 'San Antonio', 'Assigned', OFFICES[3], 21),
  seedTicket(139, 'Streetlight / Electrical', 'Pundi po ang ilaw sa may tulay.', 'Streetlight near the bridge was reported as non-functioning.', 'Molosbolos', 'Action Taken', OFFICES[0], 18),
  seedTicket(137, 'Drainage / Flooding', 'Umaapaw ang kanal sa may eskinita.', 'Drainage overflow near a neighborhood lane was reported.', 'San Isidro', 'Resolved', OFFICES[1], 14),
  seedTicket(135, 'Waste / Sanitation', 'May naiwang basura sa tabi ng plaza.', 'Uncollected waste beside the plaza was reported.', 'Poblacion', 'Resolved', OFFICES[3], 10),
  seedTicket(133, 'Road / Sidewalk', 'May lubak sa may barangay road.', 'Road surface damage was reported near the barangay road.', 'Bulusan', 'Received', OFFICES[0], 6),
  seedTicket(132, 'Waste / Sanitation', 'Uncollected garbage piling up near the market entrance.', 'Uncollected waste at the market entrance needed removal.', 'Poblacion', 'Resolved', OFFICES[3], 19),
  seedTicket(128, 'Public Facility', 'Sira po ang bench sa covered court.', 'Damaged seating at the covered court was reported.', 'Bariw', 'Resolved', OFFICES[0], 22, 8),
  seedTicket(124, 'Streetlight / Electrical', 'Madilim po sa may waiting shed.', 'A poorly lit waiting shed was reported.', 'San Isidro', 'Resolved', OFFICES[0], 17, 8),
  seedTicket(118, 'Waste / Sanitation', 'May tambak na basura sa kanal.', 'Waste blockage in drainage was reported.', 'Bulusan', 'Resolved', OFFICES[3], 10, 7),
]
seededTickets[0].location = 'Near Covered Court, Barangay San Isidro, Libon, Albay'
seededTickets[0].issueType = 'Streetlight not functioning'
seededTickets[0].residentNeed = 'Inspection and repair'
seededTickets[0].focal = 'Maintenance desk'
seededTickets[10].location = 'Poblacion, near Public Market, Libon, Albay'
seededTickets[6].routingAccepted = false
seededTickets[6].suggestedOffice = OFFICES[5]
seededTickets[10].routingAccepted = false
seededTickets[10].suggestedOffice = OFFICES[5]

const contentSeed = (id: string, section: ContentSection, title: string, category: string, office: string, body: string, status: ContentStatus = 'Published', extra: Partial<ContentItem> = {}): ContentItem => ({
  id, section, title, category, office, body, status, location: '', contact: '', hours: '', source: 'Demo municipal content review (prototype)',
  requirements: '', procedure: '', processing: '', expiresAt: '', reviewedAt: 'Sep 25, 2026', updatedBy: 'Demo Content Manager', updatedAt: at(25), ...extra,
})

const seededContent: ContentItem[] = [
  contentSeed('birth', 'Services', 'Birth Certificate Request', 'Civil Registry', 'Municipal Civil Registrar', 'Request a certified copy of a local civil registry record.', 'Published', { requirements: 'Valid government ID; Record owner details', procedure: 'Submit request at the MCR window; Pay assessed fee; Claim on release date', hours: 'Mon–Fri, 8:00 AM–5:00 PM', location: 'Municipal Hall, Ground Floor', contact: '(052) 487-1123', processing: '3–5 working days' }),
  contentSeed('business', 'Services', 'Business Permit & Licensing', 'Business', 'Business Permits & Licensing Office', 'Apply for a new business permit or renew an existing one.', 'Published', { requirements: 'DTI / SEC registration; Barangay clearance', procedure: 'Submit application; Pay assessment; Claim permit', hours: 'Mon–Fri, 8:00 AM–5:00 PM', location: 'Municipal Hall, 2nd Floor', processing: '5–7 working days' }),
  contentSeed('dental', 'Services', 'Dental Services', 'Health', 'Rural Health Unit', 'Free consultation, tooth extraction and oral health check-ups.', 'Published', { requirements: 'Valid ID or barangay certificate', procedure: 'Register at triage; Wait for queue number; Proceed to dental room', hours: 'Mon–Fri, 8:00 AM–12:00 NN', location: 'Rural Health Unit, Poblacion', contact: '(052) 487-1155', processing: 'Walk-in, same day' }),
  contentSeed('agri', 'Services', 'Agricultural Assistance Programs', 'Agriculture', 'Municipal Agriculture Office', 'Seed subsidies, farm inputs and technical support for farmers.'),
  contentSeed('scholar', 'Services', 'Scholarship & Educational Aid', 'Youth & Education', 'Municipal Social Welfare Office', 'Financial assistance for qualified student residents.'),
  contentSeed('senior', 'Services', 'Senior Citizen & PWD ID', 'Social Services', 'Municipal Social Welfare Office', 'Register for benefits, discounts and assistance programs.'),
  contentSeed('p1', 'Explore', 'Lake Danao Viewdeck', 'Destinations', 'Tourism / Local Directory', 'A quiet viewdeck overlooking the wetlands.', 'Published', { location: 'Brgy. Molosbolos', hours: 'Daily, 5:00 AM–6:00 PM', source: 'Demo local directory review' }),
  contentSeed('p2', 'Explore', 'Libon Public Market', 'Local Businesses', 'Tourism / Local Directory', 'Public market for fresh produce and everyday goods.', 'Published', { location: 'Poblacion', hours: 'Daily, 4:00 AM–7:00 PM' }),
  contentSeed('p3', 'Explore', 'Albay Harvest Café', 'Food', 'Tourism / Local Directory', 'A fictional local café serving Bicol coffee and native snacks.', 'Published', { location: 'Highway 4', hours: 'Tue–Sun, 7:00 AM–9:00 PM', contact: '0917 555 0142' }),
  contentSeed('p4', 'Explore', 'Paroy Rice & Handloom', 'Local Products', 'Tourism / Local Directory', 'Locally milled rice and handwoven products by fictional cooperatives.', 'Published', { location: 'Brgy. San Antonio' }),
  contentSeed('p5', 'Explore', 'Riverside Homestay', 'Accommodations', 'Tourism / Local Directory', 'A fictional family-run homestay near the river.', 'Published', { location: 'Brgy. Bariw' }),
  contentSeed('u1', 'Updates', 'Heavy rainfall advisory issued', 'Emergency', 'MDRRMO Libon', 'Residents in low-lying and flood-prone barangays are advised to monitor water levels and prepare emergency kits.', 'Published'),
  contentSeed('u2', 'Updates', 'Free Dental Mission at RHU', 'Programs', 'Rural Health Unit', 'The Rural Health Unit will hold a free dental mission. Bring a valid ID.', 'Published'),
  contentSeed('u3', 'Updates', 'Youth scholarship applications open', 'Opportunities', 'MSWDO Libon', 'The municipal scholarship program is accepting applications for the academic year.', 'Published'),
  contentSeed('u4', 'Updates', 'Road closure along Poblacion route', 'Advisories', 'Municipal Engineering Office', 'A section of Poblacion road is temporarily closed for concrete works.', 'Published'),
  contentSeed('u5', 'Updates', 'Paroy Festival activities announced', 'Events', 'Municipal Tourism Office', 'A week-long celebration of Libon culture, harvest and community.', 'Published'),
  contentSeed('e1', 'Help', 'MDRRMO', 'Emergency Contacts', 'MDRRMO', 'Disaster Risk Reduction', 'Published', { contact: '(052) 487-2911', location: 'Municipal Hall', hours: '24 hours' }),
  contentSeed('e2', 'Help', 'Ambulance / Health', 'Emergency Contacts', 'Rural Health Unit', 'Rural Health Unit', 'Published', { contact: '(052) 487-1155', location: 'Rural Health Unit', hours: '24 hours' }),
  contentSeed('e3', 'Help', 'Libon PNP', 'Emergency Contacts', 'Police Station', 'Police Station', 'Published', { contact: '(052) 487-1166' }),
  contentSeed('e4', 'Help', 'Fire Station', 'Emergency Contacts', 'Bureau of Fire Protection', 'Fire Station', 'Published', { contact: '(052) 487-1199' }),
  contentSeed('o1', 'Help', 'Office of the Mayor', 'Municipal Offices', 'Municipal Hall', 'Municipal Hall', 'Published', { contact: '(052) 487-1100' }),
  contentSeed('o2', 'Help', 'Civil Registrar', 'Municipal Offices', 'Municipal Civil Registrar', 'Records and certificates', 'Published', { contact: '(052) 487-1123' }),
  contentSeed('o3', 'Help', 'Social Welfare (MSWDO)', 'Municipal Offices', 'Municipal Social Welfare Office', 'Assistance and aid', 'Published', { contact: '(052) 487-1188' }),
  contentSeed('o4', 'Help', 'Agriculture Office', 'Municipal Offices', 'Municipal Agriculture Office', 'Farmer support', 'Published', { contact: '(052) 487-1170' }),
  contentSeed('k1', 'Knowledge Base', 'Dental Services guide', 'Service Requirements', 'Rural Health Unit', 'Dental care is available at the RHU on weekdays, 8:00 AM–12:00 NN. Bring a valid ID.', 'Published', { source: 'Demo RHU service guide' }),
  contentSeed('k2', 'Knowledge Base', 'Office directory', 'Office Directory', 'General Municipal Assistance', 'Contact the municipal helpdesk for office-specific guidance.', 'Published', { source: 'Demo office directory' }),
  contentSeed('k3', 'Knowledge Base', 'Emergency contacts review', 'Emergency Protocols', 'MDRRMO', 'Emergency contact directory awaiting pilot verification.', 'Pending Verification'),
  contentSeed('k4', 'Knowledge Base', 'Business Permit guide', 'Service Requirements', 'Business Permits & Licensing Office', 'For a business permit, prepare DTI/SEC registration, barangay clearance, and proof of address. Ask BPLO for the latest processing steps.', 'Published', { source: 'Demo BPLO service guide' }),
]

const seedState: DemoState = {
  tickets: seededTickets,
  content: seededContent,
  rules: [
    { id: 'r1', category: 'Streetlight / Electrical', required: 'Description + confirmed location', office: OFFICES[0], reviewedAt: 'Sep 25, 2026' },
    { id: 'r1b', category: 'Streetlight', required: 'Description + confirmed location', office: OFFICES[0], reviewedAt: 'Sep 25, 2026' },
    { id: 'r2', category: 'Drainage / Flooding', required: 'Description + severity + location', office: OFFICES[1], reviewedAt: 'Sep 25, 2026' },
    { id: 'r3', category: 'Waste / Sanitation', required: 'Description + confirmed location', office: OFFICES[3], reviewedAt: 'Sep 25, 2026' },
    { id: 'r4', category: 'Explore Correction', required: 'Listing + requested correction', office: OFFICES[4], reviewedAt: 'Sep 25, 2026' },
  ],
  users: [
    { id: 'admin', name: 'Demo Admin', role: 'System Administrator', office: 'Municipal Helpdesk', status: 'Active', lastActive: at(27, 9) },
    { id: 'focal', name: 'Demo Focal Person', role: 'Office Focal Person', office: OFFICES[0], status: 'Active', lastActive: at(26, 15) },
    { id: 'content', name: 'Demo Content Manager', role: 'Content Manager', office: 'Municipal Information Office', status: 'Active', lastActive: at(26, 14) },
    { id: 'monitor', name: 'Demo Monitor', role: 'Read-only Monitoring User', office: 'Pilot Monitoring', status: 'Active', lastActive: at(25, 10) },
  ],
  activity: [
    { id: 'a1', at: at(27, 15), actor: 'Demo Admin', action: 'Assigned to Engineering / Maintenance', record: 'LIB-2026-0147' },
    { id: 'a2', at: at(25, 14), actor: 'Demo Content Manager', action: 'Published Heavy rainfall advisory issued', record: 'u1' },
    { id: 'a3', at: at(25, 11), actor: 'Demo Content Manager', action: 'Reviewed Dental Services guide', record: 'k1' },
  ],
  activeUserId: 'admin',
}

const STORAGE_KEY = 'libon-pilot-demo-v3'
let storageError = false
function readState(): DemoState {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value) {
      const parsed = JSON.parse(value) as DemoState
      if (Array.isArray(parsed.tickets) && Array.isArray(parsed.content) && Array.isArray(parsed.activity)) return parsed
      storageError = true
    }
  } catch (error) {
    if (error instanceof SyntaxError) storageError = true
    // Private browsing can disable storage; in-memory demo remains usable.
  }
  return seedState
}
let state = readState()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(listener => listener())
export function useDemoStore() { return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener) } }, () => state) }
export function getDemoState() { return state }
export function hasDemoStoreError() { return storageError }
export function updateDemoStore(change: (draft: DemoState) => void) {
  const draft = structuredClone(state)
  change(draft)
  state = draft
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* Keep the in-memory prototype working. */ }
  emit()
}
export function reloadDemoStore() { storageError = false; state = readState(); emit() }
export function resetDemoStore() {
  state = structuredClone(seedState)
  storageError = false
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* Keep in-memory demo usable. */ }
  emit()
}
export function addActivity(draft: DemoState, actor: string, action: string, record: string) {
  draft.activity.unshift({ id: `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), actor, action, record })
}
export function nextTicketId(tickets: Ticket[]) { return `LIB-2026-${String(Math.max(147, ...tickets.map(ticket => Number(ticket.id.slice(-4)))) + 1).padStart(4, '0')}` }
export function formatDate(value: string, withTime = false) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric', ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}) }).format(date)
}
export function csvDataUrl(rows: (string | number)[][]) {
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')
  return `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(csv)}`
}
