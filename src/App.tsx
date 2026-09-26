import { useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Squares2X2Icon,
  FlagIcon,
  MegaphoneIcon,
  PhoneIcon,
  MapIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  TicketIcon,
  MapPinIcon,
  BellIcon,
} from '@heroicons/react/24/solid'

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
type IconName =
  | 'home' | 'grid' | 'chat' | 'flag' | 'more' | 'search' | 'bell' | 'arrow' | 'back'
  | 'pin' | 'camera' | 'mic' | 'check' | 'phone' | 'ticket' | 'file' | 'heart' | 'leaf'
  | 'megaphone' | 'clock' | 'send' | 'plus' | 'x' | 'edit' | 'globe' | 'shield' | 'users'
  | 'book' | 'graduation' | 'store' | 'sparkle' | 'chevron' | 'map' | 'star' | 'cross'
  | 'tractor' | 'briefcase' | 'accessibility' | 'info' | 'trash' | 'water' | 'road' | 'bulb'

function Icon({ name, size = 20, stroke = 1.9, filled = false }: { name: IconName; size?: number; stroke?: number; filled?: boolean }) {
  if (filled) {
    const fp: Partial<Record<IconName, ReactNode>> = {
      home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor" />,
      grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" /></>,
      flag: <><line x1="5" y1="4" x2="5" y2="21" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" /><path d="M5 5c4-3 7 3 14 0v10c-7 3-10-3-14 0z" fill="currentColor" /></>,
      more: <><circle cx="5" cy="12" r="2.2" fill="currentColor" /><circle cx="12" cy="12" r="2.2" fill="currentColor" /><circle cx="19" cy="12" r="2.2" fill="currentColor" /></>,
      megaphone: <path d="M4 13l13-5v10L4 13zM17 10l3-2v10l-3-2M6 14l1 5h3l-1-4" fill="currentColor" />,
      phone: <path d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3c0 1-1 2-2 2C10.3 21 3 13.7 3 6c0-1 .9-2 2-2Z" fill="currentColor" />,
      map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14" fill="currentColor" />,
      ticket: <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" fill="currentColor" />,
    }
    if (fp[name]) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="none">{fp[name]}</svg>
  }
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const p: Record<IconName, ReactNode> = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    chat: <><path d="M20 15a4 4 0 0 1-4 4H8l-4 3v-7a4 4 0 0 1-2-3.5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 5c4-3 7 3 14 0v10c-7 3-10-3-14 0" /></>,
    more: <><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16.5 16.5 4 4" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    back: <path d="M19 12H5M11 18l-6-6 6-6" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    camera: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    phone: <path d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3c0 1-1 2-2 2C10.3 21 3 13.7 3 6c0-1 .9-2 2-2Z" />,
    ticket: <><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z" /><path d="M12 6v12" strokeDasharray="2 2.5" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />,
    leaf: <><path d="M20 3C9 3 4 8 4 16c0 3 2 5 5 5 8 0 11-10 11-18Z" /><path d="M4 21c2-5 6-9 12-12" /></>,
    megaphone: <><path d="m4 13 13-5v10L4 13zM17 10l3-2v10l-3-2M6 14l1 5h3l-1-4" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    send: <><path d="m21 3-7 18-3-8-8-3z" /><path d="m11 13 4-4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m14 6 4 4" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    shield: <><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.5a3 3 0 0 1 0 5.5M21 20c0-2.5-1.5-4.6-3.6-5.5" /></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>,
    graduation: <><path d="m3 8 9-4 9 4-9 4z" /><path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>,
    store: <><path d="M4 9 5 4h14l1 5M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M9 20v-5h6v5" /></>,
    sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
    star: <path d="M12 3.5l2.6 5.6 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6L4.4 9.9l6-.8z" />,
    cross: <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />,
    tractor: <><circle cx="7" cy="17" r="3" /><circle cx="18" cy="18" r="2.5" /><path d="M4 17V8h6l2 5h4M10 8V5h4v3" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
    accessibility: <><circle cx="12" cy="4.5" r="1.6" /><path d="M12 7v6m0 0-3 5m3-5 3 5M6 9h12" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></>,
    water: <path d="M12 3s7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 7-12 7-12Z" />,
    road: <><path d="M8 4 4 20M16 4l4 16M12 5v2M12 11v2M12 17v2" /></>,
    bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.8 1 1.3 1 2.5h6c0-1.2.3-1.7 1-2.5A6 6 0 0 0 12 3Z" /></>,
  }
  return <svg {...common}>{p[name]}</svg>
}

/* Photo with loading skeleton + tasteful category fallback (no broken-image icon) */
function Photo({ src, alt, icon, className }: { src: string; alt: string; icon: IconName; className?: string }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <span className={`photo ${className ?? ''} ${state}`}>
      {state === 'loading' && <span className="photo-skeleton" />}
      {state === 'error' && <span className="photo-fallback"><Icon name={icon} size={26} /></span>}
      <img src={src} alt={alt} loading="lazy" onLoad={() => setState('ok')} onError={() => setState('error')}
        style={{ opacity: state === 'ok' ? 1 : 0 }} />
    </span>
  )
}

/* Bonly — the palay-grain mascot */
function Bonly({ size = 46 }: { size?: number }) {
  return (
    <span className="bonly" style={{ width: size, height: size }} aria-hidden>
      <span className="grain g1" /><span className="grain g2" />
      <span className="face"><i /><i /></span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */
type Service = { id: string; title: string; office: string; desc: string; cat: string; icon: IconName; online?: boolean; reqs: string[]; steps: string[]; hours: string; contact: string; location: string; processing: string }
const CATEGORIES = ['All', 'Civil Registry', 'Business', 'Health', 'Social Services', 'Agriculture', 'Youth & Education', 'Tourism & Culture', 'Others']

const SERVICES: Service[] = [
  { id: 'birth', title: 'Birth Certificate Request', office: 'Municipal Civil Registrar', desc: 'Request a certified copy of a local civil registry record.', cat: 'Civil Registry', icon: 'file', online: true, hours: 'Mon–Fri, 8:00 AM – 5:00 PM', contact: '(052) 487-1123', location: 'Municipal Hall, Ground Floor', processing: '3–5 working days', reqs: ['Valid government-issued ID of requester', 'Full name of record owner', 'Date and place of birth', 'Purpose of request'], steps: ['Fill out the request form at the MCR window', 'Present valid ID and pay the assessed fee', 'Claim the certified copy on the release date'] },
  { id: 'business', title: 'Business Permit & Licensing', office: 'Business Permits & Licensing Office', desc: 'Apply for a new business permit or renew an existing one.', cat: 'Business', icon: 'briefcase', online: true, hours: 'Mon–Fri, 8:00 AM – 5:00 PM', contact: '(052) 487-1140', location: 'Municipal Hall, 2nd Floor', processing: '5–7 working days', reqs: ['DTI / SEC registration', 'Barangay business clearance', 'Lease contract or proof of address', 'Occupancy / sanitary permit'], steps: ['Secure a barangay business clearance', 'Submit the unified application form at BPLO', 'Pay assessed taxes and regulatory fees', 'Claim the released permit and plate'] },
  { id: 'dental', title: 'Dental Services', office: 'Rural Health Unit', desc: 'Free consultation, tooth extraction and oral health check-ups.', cat: 'Health', icon: 'cross', hours: 'Mon–Fri, 8:00 AM – 12:00 NN', contact: '(052) 487-1155', location: 'Rural Health Unit, Poblacion', processing: 'Walk-in, same day', reqs: ['Any valid ID or barangay certificate', 'Health record if available'], steps: ['Register at the RHU triage desk', 'Wait for your queue number', 'Proceed to the dental service room'] },
  { id: 'agri', title: 'Agricultural Assistance Programs', office: 'Municipal Agriculture Office', desc: 'Seed subsidies, farm inputs and technical support for farmers.', cat: 'Agriculture', icon: 'tractor', hours: 'Mon–Fri, 8:00 AM – 5:00 PM', contact: '(052) 487-1170', location: 'Municipal Agriculture Office', processing: 'Subject to program schedule', reqs: ['Registered farmer (RSBSA) number', 'Valid ID', 'Proof of farm / land tenure'], steps: ['Verify RSBSA registration', 'Submit application for the active program', 'Attend orientation and claim inputs'] },
  { id: 'scholar', title: 'Scholarship & Educational Aid', office: 'Municipal Social Welfare Office', desc: 'Financial assistance for qualified student residents.', cat: 'Youth & Education', icon: 'graduation', online: true, hours: 'Mon–Fri, 8:00 AM – 5:00 PM', contact: '(052) 487-1188', location: 'MSWDO, Municipal Hall', processing: 'Per application cycle', reqs: ['Certificate of enrollment / grades', 'Barangay indigency certificate', 'Valid ID of student and guardian'], steps: ['Check the open application period', 'Submit documents at MSWDO', 'Attend the qualification interview'] },
  { id: 'senior', title: 'Senior Citizen & PWD ID', office: 'Municipal Social Welfare Office', desc: 'Register for benefits, discounts and assistance programs.', cat: 'Social Services', icon: 'users', hours: 'Mon–Fri, 8:00 AM – 5:00 PM', contact: '(052) 487-1188', location: 'MSWDO, Municipal Hall', processing: '1–2 working days', reqs: ['Birth certificate or proof of age', '1x1 ID photo', 'Proof of Libon residency'], steps: ['Fill out the OSCA / PWD form', 'Submit requirements at MSWDO', 'Claim your ID and booklet'] },
]

type Update = { id: string; label: string; type: string; title: string; date: string; preview: string; body: string; office: string; photo?: string; photoAlt?: string }
const UPDATE_FILTERS = ['All', 'Advisories', 'Programs', 'Opportunities', 'Events', 'Emergency']
const UPDATES: Update[] = [
  { id: 'u1', label: 'Emergency', type: 'Emergency', title: 'Heavy rainfall advisory issued', date: 'Sep 25, 2026', preview: 'PAGASA warns of moderate to heavy rain over Albay this afternoon.', office: 'MDRRMO Libon', photo: '1515694346937-94d85e41e6f0', photoAlt: 'Heavy rain over green hills', body: 'Residents in low-lying and flood-prone barangays are advised to monitor water levels and prepare emergency kits. Coordinate with your barangay for pre-emptive evacuation if advised.' },
  { id: 'u2', label: 'Programs', type: 'Programs', title: 'Free Dental Mission at RHU', date: 'Sep 28, 2026', preview: 'Open to all Libon residents, 8:00 AM – 3:00 PM at the Rural Health Unit.', office: 'Rural Health Unit', photo: '1588776814546-1ffcf47267a5', photoAlt: 'Medical clinic consultation room', body: 'The Rural Health Unit will hold a free dental mission offering consultations and tooth extractions. Bring any valid ID. Slots are on a first-come, first-served basis.' },
  { id: 'u3', label: 'Opportunities', type: 'Opportunities', title: 'Youth scholarship applications open', date: 'Sep 22, 2026', preview: 'Qualified student residents may now apply for the 2026 educational aid.', office: 'MSWDO Libon', photo: '1523240795612-9a054b0db644', photoAlt: 'Students studying together', body: 'The municipal scholarship program is now accepting applications for the academic year. Submit your certificate of enrollment, grades and barangay indigency certificate at the MSWDO.' },
  { id: 'u4', label: 'Advisories', type: 'Advisories', title: 'Road closure along Poblacion route', date: 'Sep 20, 2026', preview: 'Temporary closure for re-blocking works. Use the alternate barangay road.', office: 'Municipal Engineering Office', photo: '1517649763962-0c623266ddc0', photoAlt: 'Road maintenance equipment', body: 'A section of the Poblacion road will be closed for concrete re-blocking. Motorists are advised to use the alternate route via Brgy. San Isidro. Works are expected to finish within two weeks.' },
  { id: 'u5', label: 'Events', type: 'Events', title: 'Paroy Festival activities announced', date: 'Sep 18, 2026', preview: 'A week-long celebration of Libon culture, harvest and community.', office: 'Municipal Tourism Office', photo: '1536153635972-1fc2e818f642', photoAlt: 'Harvest rice grains display', body: 'Join the annual Paroy Festival featuring street dancing, an agri-trade fair and cultural showcases across the town plaza. See the full schedule of activities at the Tourism Office.' },
]

type Place = { id: string; name: string; cat: string; brgy: string; icon: IconName; photo: string; alt: string; desc: string; hours: string; contact: string }
const EXPLORE_FILTERS = ['All', 'Destinations', 'Food', 'Local Businesses', 'Accommodations', 'Local Products']
// Photos are illustrative, category-representative stock imagery (not identifying a
// specific establishment). Build sized, cropped, lazy-loaded URLs from the base id.
const imgUrl = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=70`
const PLACES: Place[] = [
  { id: 'p1', name: 'Lake Danao Viewdeck', cat: 'Destinations', brgy: 'Brgy. Molosbolos', icon: 'map', photo: '1668214748411-d241e83103a1', alt: 'Calm lake and wetland with hills in the background', desc: 'A quiet viewdeck overlooking the wetlands, popular for sunrise walks and local birdwatching.', hours: 'Open daily, 5:00 AM – 6:00 PM', contact: 'Barangay Molosbolos' },
  { id: 'p2', name: 'Libon Public Market', cat: 'Local Businesses', brgy: 'Poblacion', icon: 'store', photo: '1784076525443-382a6ac435ae', alt: 'Fresh produce stalls at a public market', desc: 'The town’s main market for fresh produce, seafood and everyday goods.', hours: 'Daily, 4:00 AM – 7:00 PM', contact: 'Market Administration Office' },
  { id: 'p3', name: 'Albay Harvest Café', cat: 'Food', brgy: 'Highway 4', icon: 'store', photo: '1600093463592-8e36ae95ef56', alt: 'Rustic café interior with wooden tables and hanging plants', desc: 'A homegrown café serving Bicol coffee, native kakanin and light meals.', hours: 'Tue–Sun, 7:00 AM – 9:00 PM', contact: '0917 555 0142' },
  { id: 'p4', name: 'Paroy Rice & Handloom', cat: 'Local Products', brgy: 'Brgy. San Antonio', icon: 'leaf', photo: '1536153635972-1fc2e818f642', alt: 'Woven basket resting on freshly milled rice grains', desc: 'Locally milled rice and handwoven products made by Libon farming cooperatives.', hours: 'Mon–Sat, 8:00 AM – 5:00 PM', contact: '0918 555 0177' },
  { id: 'p5', name: 'Riverside Homestay', cat: 'Accommodations', brgy: 'Brgy. Bariw', icon: 'home', photo: '1758298134892-363f0aa7dc91', alt: 'Boats docked on a calm river with mountains behind', desc: 'A family-run homestay near the river, offering simple rooms and home-cooked meals.', hours: 'Check-in from 2:00 PM', contact: '0920 555 0199' },
]

type Contact = { id: string; name: string; sub: string; icon: IconName; number: string }
const EMERGENCY: Contact[] = [
  { id: 'e1', name: 'MDRRMO', sub: 'Disaster Risk Reduction', icon: 'shield', number: '(052) 487-2911' },
  { id: 'e2', name: 'Ambulance / Health', sub: 'Rural Health Unit', icon: 'cross', number: '(052) 487-1155' },
  { id: 'e3', name: 'Libon PNP', sub: 'Police Station', icon: 'flag', number: '(052) 487-1166' },
  { id: 'e4', name: 'Fire Station', sub: 'Bureau of Fire Protection', icon: 'flag', number: '(052) 487-1199' },
]
const OFFICES: Contact[] = [
  { id: 'o1', name: 'Office of the Mayor', sub: 'Municipal Hall', icon: 'briefcase', number: '(052) 487-1100' },
  { id: 'o2', name: 'Civil Registrar', sub: 'Records & certificates', icon: 'file', number: '(052) 487-1123' },
  { id: 'o3', name: 'Social Welfare (MSWDO)', sub: 'Assistance & aid', icon: 'users', number: '(052) 487-1188' },
  { id: 'o4', name: 'Agriculture Office', sub: 'Farmer support', icon: 'tractor', number: '(052) 487-1170' },
]

const REPORT_CATS: { key: string; icon: IconName }[] = [
  { key: 'Streetlight', icon: 'bulb' }, { key: 'Road / Sidewalk', icon: 'road' }, { key: 'Drainage / Flooding', icon: 'water' },
  { key: 'Waste / Sanitation', icon: 'trash' }, { key: 'Public Facility', icon: 'store' }, { key: 'Environmental', icon: 'leaf' },
  { key: 'Public Safety', icon: 'shield' }, { key: 'Other', icon: 'info' },
]

type Report = { id: string; category: string; icon: IconName; desc: string; location: string; date: string; status: string; resolved: boolean; timeline: { title: string; sub: string; office?: string; time: string; done: boolean; active?: boolean }[] }
const seedReport: Report = {
  id: 'LIB-2026-0132', category: 'Waste / Sanitation', icon: 'trash', desc: 'Uncollected garbage piling up near the market entrance.', location: 'Poblacion, near Public Market', date: 'Sep 19, 2026', status: 'Resolved', resolved: true,
  timeline: [
    { title: 'Submitted', sub: 'Your report was received by LibON.', time: 'Sep 19, 8:10 AM', done: true },
    { title: 'Received', sub: 'Validated by the Municipal Helpdesk.', time: 'Sep 19, 9:30 AM', done: true },
    { title: 'Assigned', sub: 'Forwarded for collection.', office: 'General Services Office', time: 'Sep 19, 11:00 AM', done: true },
    { title: 'Action Taken', sub: 'Collection crew dispatched to the area.', office: 'General Services Office', time: 'Sep 20, 7:20 AM', done: true },
    { title: 'Resolved', sub: 'Area cleared and collection resumed.', time: 'Sep 20, 10:15 AM', done: true },
  ],
}

/* ------------------------------------------------------------------ */
/* Navigation types                                                    */
/* ------------------------------------------------------------------ */
type ScreenName =
  | 'home' | 'notifications' | 'search'
  | 'services' | 'serviceDetail'
  | 'report' | 'reportSuccess' | 'myReports' | 'tracking'
  | 'chat'
  | 'explore' | 'exploreDetail'
  | 'updates' | 'updateDetail'
  | 'help' | 'more'
type Route = { screen: ScreenName; param?: string }
type Nav = { go: (screen: ScreenName, param?: string) => void; back: () => void; canBack: boolean }

const TAB_OF: Partial<Record<ScreenName, string>> = {
  home: 'Home', notifications: 'Home', search: 'Home',
  services: 'Services', serviceDetail: 'Services',
  report: 'Report', reportSuccess: 'Report', myReports: 'Report', tracking: 'Report',
  chat: 'Bonly',
  explore: 'More', exploreDetail: 'More', updates: 'More', updateDetail: 'More', help: 'More', more: 'More',
}

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */
function TopBar({ title, nav, action }: { title: string; nav: Nav; action?: ReactNode }) {
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={nav.back} aria-label="Go back"><Icon name="back" size={22} /></button>
      <h1>{title}</h1>
      <div className="topbar-action">{action}</div>
    </header>
  )
}

function SectionHead({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {actionLabel && <button className="link-btn" onClick={onAction}>{actionLabel}</button>}
    </div>
  )
}

function Chips({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="chips no-scrollbar">
      {items.map(c => (
        <button key={c} className={`chip ${value === c ? 'chip-on' : ''}`} onClick={() => onChange(c)}>{c}</button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */
function Home({ nav, reports }: { nav: Nav; reports: Report[] }) {
  const active = reports.find(r => !r.resolved)
  return (
    <div className="scroll no-scrollbar">
      <div className="home-head">
        <div className="util-row">
          <div className="place-row"><MapPinIcon className="place-pin" aria-hidden="true" /> Burabod, Libon, Albay</div>
          <div className="util-actions">
            <button className="bell-btn" onClick={() => nav.go('notifications')} aria-label="Notifications">
              <BellIcon className="bell-icon" aria-hidden="true" /><b />
            </button>
          </div>
        </div>
        <p className="greeting">Maray na aldaw, <span className="greeting-name">John Carlo</span>!</p>
        <h2 className="home-title">Your town, <em>within reach.</em></h2>
        <button className="searchbar" onClick={() => nav.go('search')}>
          <Icon name="search" size={19} /><span>Search services, updates, places…</span>
        </button>
      </div>

      <div className="pad">
        <h3 className="ask-head">What do you need?</h3>
        <div className="action-grid">
          <QuickAction heroIcon={<Squares2X2Icon className="quick-hi" />} label="Services" onClick={() => nav.go('services')} />
          <QuickAction heroIcon={<FlagIcon className="quick-hi" />} label="Report" onClick={() => nav.go('report')} />
          <QuickAction heroIcon={<MegaphoneIcon className="quick-hi" />} label="Updates" onClick={() => nav.go('updates')} />
          <QuickAction heroIcon={<PhoneIcon className="quick-hi" />} label="Emergency" tone="emergency" onClick={() => nav.go('help')} />
          <QuickAction heroIcon={<MapIcon className="quick-hi" />} label="Explore" onClick={() => nav.go('explore')} />
          <QuickAction heroIcon={<BuildingOffice2Icon className="quick-hi" />} label="Offices" onClick={() => nav.go('help', 'offices')} />
          <QuickAction heroIcon={<BriefcaseIcon className="quick-hi" />} label="Opportunities" onClick={() => nav.go('updates', 'Opportunities')} />
          <QuickAction heroIcon={<TicketIcon className="quick-hi" />} label="My Reports" onClick={() => nav.go('myReports')} />
        </div>

        <button className="bonly-card" onClick={() => nav.go('chat')}>
          <img src="/src/assets/bonly-card-icon.png" alt="Bonly" className="bonly-card-avatar" />
          <div className="bonly-card-text">
            <p>Need help?</p>
            <strong>Talk to Bonly</strong>
            <span>Ask about services, reports, or local info.</span>
          </div>
          <span className="bonly-card-arrow"><Icon name="arrow" size={20} /></span>
        </button>

        <SectionHead title="Latest Updates" actionLabel="View all" onAction={() => nav.go('updates')} />
        <div className="update-list">
          {UPDATES.slice(0, 2).map(u => (
            <button key={u.id} className="update-line" onClick={() => nav.go('updateDetail', u.id)}>
              {u.photo && <Photo src={imgUrl(u.photo, 180, 180)} alt={u.photoAlt || u.title} icon="megaphone" className="update-thumb" />}
              <div>
                <span className={`u-eyebrow e-${u.type.toLowerCase()}`}>{u.label.toUpperCase()}</span>
                <strong>{u.title}</strong>
                <small>{u.office} · {u.date}</small>
              </div>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </div>

        <SectionHead title="Popular Services" actionLabel="See all" onAction={() => nav.go('services')} />
        <div className="service-list">
          {SERVICES.slice(0, 3).map(s => (
            <button key={s.id} className="service-row" onClick={() => nav.go('serviceDetail', s.id)}>
              <span className="mini-icon sm"><Icon name={s.icon} size={19} /></span>
              <div><strong>{s.title}</strong><small>{s.office}</small></div>
              <Icon name="chevron" size={17} />
            </button>
          ))}
        </div>

        {active && (
          <>
            <SectionHead title="Active report" actionLabel="My reports" onAction={() => nav.go('myReports')} />
            <button className="track-card" onClick={() => nav.go('tracking', active.id)}>
              <span className="track-icon"><Icon name={active.icon} size={20} /></span>
              <div className="track-body">
                <strong>{active.category}</strong>
                <small>{active.id}</small>
                <span className="track-updated">Status: {active.status} · Updated {active.timeline.filter(t => t.done).slice(-1)[0]?.time}</span>
              </div>
              <span className="status-chip">{active.status}</span>
            </button>
          </>
        )}
        <div className="scroll-pad" />
      </div>
    </div>
  )
}
function QuickAction({ heroIcon, label, tone, onClick }: { heroIcon: ReactNode; label: string; tone?: string; onClick: () => void }) {
  return (
    <button className={`quick ${tone === 'emergency' ? 'quick-emergency' : ''}`} onClick={onClick}>
      <span className="quick-icon">{heroIcon}</span>
      <span className="quick-label">{label}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* NOTIFICATIONS                                                       */
/* ------------------------------------------------------------------ */
function Notifications({ nav }: { nav: Nav }) {
  const items = [
    { icon: 'ticket' as IconName, title: 'Report status updated', body: 'LIB-2026-0132 has been resolved.', time: '2h ago', go: () => nav.go('tracking', 'LIB-2026-0132'), unread: true },
    { icon: 'megaphone' as IconName, title: 'New municipal advisory', body: 'Heavy rainfall advisory issued for Albay.', time: '5h ago', go: () => nav.go('updateDetail', 'u1'), unread: true },
    { icon: 'graduation' as IconName, title: 'New opportunity', body: 'Youth scholarship applications are now open.', time: 'Yesterday', go: () => nav.go('updateDetail', 'u3'), unread: false },
  ]
  return (
    <div className="scroll no-scrollbar">
      <TopBar title="Notifications" nav={nav} />
      <div className="pad">
        {items.map((n, i) => (
          <button key={i} className={`notif ${n.unread ? 'unread' : ''}`} onClick={n.go}>
            <span className="notif-icon"><Icon name={n.icon} size={19} /></span>
            <div>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <small>{n.time}</small>
            </div>
            {n.unread && <i className="dot" />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* GLOBAL SEARCH                                                       */
/* ------------------------------------------------------------------ */
function Search({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('')
  const ql = q.trim().toLowerCase()
  const svc = ql ? SERVICES.filter(s => (s.title + s.office + s.cat).toLowerCase().includes(ql)) : []
  const ups = ql ? UPDATES.filter(u => (u.title + u.type).toLowerCase().includes(ql)) : []
  const pls = ql ? PLACES.filter(p => (p.name + p.cat + p.brgy).toLowerCase().includes(ql)) : []
  const cts = ql ? [...EMERGENCY, ...OFFICES].filter(c => (c.name + c.sub).toLowerCase().includes(ql)) : []
  const total = svc.length + ups.length + pls.length + cts.length
  return (
    <div className="scroll no-scrollbar">
      <header className="search-head">
        <button className="icon-btn" onClick={nav.back} aria-label="Back"><Icon name="back" size={22} /></button>
        <div className="search-field">
          <Icon name="search" size={18} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search services, updates, places…" />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><Icon name="x" size={16} /></button>}
        </div>
      </header>
      <div className="pad">
        {!ql && (
          <>
            <p className="search-hint">Try searching for</p>
            <div className="chips">
              {['Dental', 'Business permit', 'Scholarship', 'Flooding'].map(s => (
                <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
              ))}
            </div>
          </>
        )}
        {ql && total === 0 && <div className="empty-block"><Icon name="search" size={30} /><p>No results for “{q}”.</p></div>}
        {svc.length > 0 && <SearchGroup label="Services">{svc.map(s => <SearchRow key={s.id} icon={s.icon} title={s.title} sub={s.office} onClick={() => nav.go('serviceDetail', s.id)} />)}</SearchGroup>}
        {cts.length > 0 && <SearchGroup label="Contacts & offices">{cts.map(c => <SearchRow key={c.id} icon={c.icon} title={c.name} sub={c.number} onClick={() => nav.go('help')} />)}</SearchGroup>}
        {ups.length > 0 && <SearchGroup label="Updates">{ups.map(u => <SearchRow key={u.id} icon="megaphone" title={u.title} sub={u.date} onClick={() => nav.go('updateDetail', u.id)} />)}</SearchGroup>}
        {pls.length > 0 && <SearchGroup label="Explore">{pls.map(p => <SearchRow key={p.id} icon="pin" title={p.name} sub={p.brgy} onClick={() => nav.go('exploreDetail', p.id)} />)}</SearchGroup>}
      </div>
    </div>
  )
}
function SearchGroup({ label, children }: { label: string; children: ReactNode }) {
  return <div className="search-group"><p className="group-label">{label}</p>{children}</div>
}
function SearchRow({ icon, title, sub, onClick }: { icon: IconName; title: string; sub: string; onClick: () => void }) {
  return (
    <button className="search-row" onClick={onClick}>
      <span className="mini-icon sm"><Icon name={icon} size={18} /></span>
      <div><strong>{title}</strong><small>{sub}</small></div>
      <Icon name="chevron" size={17} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* SERVICES                                                            */
/* ------------------------------------------------------------------ */
function Services({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const ql = q.trim().toLowerCase()
  const list = SERVICES.filter(s => (cat === 'All' || s.cat === cat) && (!ql || (s.title + s.office).toLowerCase().includes(ql)))
  return (
    <div className="scroll no-scrollbar">
      <div className="plain-head">
        <h1>Services</h1>
        <p>Find requirements, offices, and service links.</p>
        <div className="search-field embedded">
          <Icon name="search" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="What service are you looking for?" />
        </div>
      </div>
      <div className="sticky-chips"><Chips items={CATEGORIES} value={cat} onChange={setCat} /></div>
      <div className="pad">
        {list.length === 0 && <div className="empty-block"><Icon name="grid" size={30} /><p>No services match your search.</p></div>}
        {list.map(s => (
          <button key={s.id} className="service-card" onClick={() => nav.go('serviceDetail', s.id)}>
            <span className="service-icon"><Icon name={s.icon} size={22} /></span>
            <div className="service-text">
              <strong>{s.title}</strong>
              <small>{s.office}</small>
              <p>{s.desc}</p>
              <span className="avail"><i /> Available today</span>
            </div>
            <Icon name="chevron" size={18} />
          </button>
        ))}
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

function ServiceDetail({ nav, id }: { nav: Nav; id?: string }) {
  const s = SERVICES.find(x => x.id === id) ?? SERVICES[0]
  return (
    <div className="scroll no-scrollbar">
      <TopBar title="Service details" nav={nav} />
      <div className="pad">
        <div className="detail-hero">
          <span className="service-icon large"><Icon name={s.icon} size={28} /></span>
          <div>
            <span className="eyebrow">{s.cat.toUpperCase()}</span>
            <h2>{s.title}</h2>
            <p>{s.office}</p>
          </div>
        </div>
        <div className="info-strip">
          <span><Icon name="clock" size={15} /> {s.processing}</span>
          <span><Icon name="pin" size={15} /> {s.location}</span>
        </div>

        <div className="detail-block">
          <h3>Requirements</h3>
          <ul className="check-list">{s.reqs.map((r, i) => <li key={i}><Icon name="check" size={16} /> {r}</li>)}</ul>
        </div>
        <div className="detail-block">
          <h3>Steps</h3>
          <ol className="step-list">{s.steps.map((st, i) => <li key={i}><b>{i + 1}</b><span>{st}</span></li>)}</ol>
        </div>
        <div className="detail-block">
          <h3>Office information</h3>
          <div className="info-card">
            <div><Icon name="clock" size={16} /><span>{s.hours}</span></div>
            <div><Icon name="pin" size={16} /><span>{s.location}</span></div>
            <div><Icon name="phone" size={16} /><span>{s.contact}</span></div>
          </div>
        </div>

        {s.online && (
          <div className="online-note">
            <Icon name="globe" size={18} />
            <div>
              <strong>Online service available</strong>
              <p>LibON links you to the existing official system for this transaction.</p>
            </div>
          </div>
        )}
        {s.online && <button className="btn-primary">Continue to Official Online System <Icon name="arrow" size={18} /></button>}
        <button className="btn-bonly" onClick={() => nav.go('chat')}><Bonly size={26} /> Ask Bonly about this service</button>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* REPORT WIZARD                                                       */
/* ------------------------------------------------------------------ */
type Draft = { category: string; icon: IconName; desc: string; photo: boolean; location: string }
function ReportFlow({ nav, submit }: { nav: Nav; submit: (d: Draft) => void }) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<Draft>({ category: '', icon: 'info', desc: '', photo: false, location: 'Brgy. San Isidro, Libon' })
  const set = (p: Partial<Draft>) => setDraft(d => ({ ...d, ...p }))

  const canNext = step === 1 ? !!draft.category : step === 2 ? draft.desc.trim().length > 4 : true

  const goNext = () => { if (step < 4) setStep(step + 1); else submit(draft) }
  const goBack = () => { if (step > 1) setStep(step - 1); else nav.back() }

  return (
    <div className="scroll no-scrollbar">
      <header className="topbar">
        <button className="icon-btn" onClick={goBack} aria-label="Back"><Icon name="back" size={22} /></button>
        <h1>Report a Concern</h1>
        <button className="link-btn" onClick={() => nav.go('myReports')}>My reports</button>
      </header>
      <div className="progress">
        <div className="progress-track"><span style={{ width: `${step * 25}%` }} /></div>
        <p>Step {step} of 4</p>
      </div>

      <div className="pad">
        {step === 1 && (
          <>
            <h2 className="step-title">What would you like to report?</h2>
            <div className="report-cats">
              {REPORT_CATS.map(c => (
                <button key={c.key} className={`report-cat ${draft.category === c.key ? 'selected' : ''}`} onClick={() => set({ category: c.key, icon: c.icon })}>
                  <Icon name={c.icon} size={22} />
                  <span>{c.key}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="step-title">Tell us what happened</h2>
            <p className="step-sub">Describe the problem in your own words. <b className="req">*required</b></p>
            <textarea className="textarea" value={draft.desc} onChange={e => set({ desc: e.target.value })}
              placeholder="e.g. The streetlight near our street hasn't been working for several nights." />
            <button className="btn-bonly small" onClick={() => set({ desc: draft.desc || 'Non-functioning streetlight near our street for several nights, making the area very dark.' })}>
              <Bonly size={24} /> Help me describe this
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="step-title">Evidence & location</h2>
            {draft.photo ? (
              <div className="photo-captured">
                <div className="photo-thumb"><Icon name="camera" size={26} /></div>
                <div><strong>Photo captured</strong><small>Sep 25, 2026, 8:41 PM</small></div>
                <button className="link-btn" onClick={() => set({ photo: false })}>Retake</button>
              </div>
            ) : (
              <button className="camera-btn" onClick={() => set({ photo: true })}>
                <Icon name="camera" size={26} /><span>Take Photo</span><small>Recommended evidence for this report</small>
              </button>
            )}

            <div className="location-confirm">
              <div className="map-preview"><Icon name="pin" size={26} /></div>
              <div className="location-text">
                <strong>Confirm location</strong>
                <p>{draft.location}</p>
                <small>Device coordinates: 13.3049° N, 123.4382° E</small>
              </div>
            </div>
            <button className="btn-outline" onClick={() => set({ location: draft.location === 'Brgy. San Isidro, Libon' ? 'Poblacion, Libon' : 'Brgy. San Isidro, Libon' })}>Adjust location</button>

            <div className="privacy">
              <Icon name="shield" size={16} />
              <span>Your location and photo are used only to help the LGU understand and route this report.</span>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="step-title">Review your report</h2>
            <div className="review">
              <ReviewRow label="Category" value={draft.category} onEdit={() => setStep(1)} />
              <ReviewRow label="Description" value={draft.desc} onEdit={() => setStep(2)} />
              <ReviewRow label="Location" value={draft.location} onEdit={() => setStep(3)} />
              <div className="review-row">
                <div><span className="review-label">Photo</span>
                  {draft.photo ? <div className="review-photo"><Icon name="camera" size={18} /> 1 photo attached</div> : <p className="review-value muted">No photo attached</p>}
                </div>
                <button className="link-btn" onClick={() => setStep(3)}>Edit</button>
              </div>
            </div>
            <p className="privacy plain"><Icon name="info" size={15} /> Authorized LGU personnel review every report before any official action.</p>
          </>
        )}
      </div>

      <div className="wizard-foot">
        {step === 4 && <button className="btn-outline half" onClick={() => setStep(3)}>Edit</button>}
        <button className={`btn-primary ${step === 4 ? 'half' : ''}`} disabled={!canNext} onClick={goNext}>
          {step === 4 ? 'Submit Report' : 'Continue'} {step < 4 && <Icon name="arrow" size={18} />}
        </button>
      </div>
    </div>
  )
}
function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="review-row">
      <div><span className="review-label">{label}</span><p className="review-value">{value}</p></div>
      <button className="link-btn" onClick={onEdit}>Edit</button>
    </div>
  )
}

function ReportSuccess({ nav, id }: { nav: Nav; id?: string }) {
  return (
    <div className="scroll no-scrollbar center-screen">
      <div className="success">
        <span className="success-check"><Icon name="check" size={40} /></span>
        <h2>Report submitted</h2>
        <div className="ticket-pill">Ticket: {id}</div>
        <p>Your report has been received by LibON and will be reviewed by authorized LGU personnel.</p>
        <button className="btn-primary" onClick={() => nav.go('tracking', id)}>Track Report <Icon name="arrow" size={18} /></button>
        <button className="btn-outline" onClick={() => nav.go('home')}>Return Home</button>
      </div>
    </div>
  )
}

function MyReports({ nav, reports }: { nav: Nav; reports: Report[] }) {
  const [tab, setTab] = useState<'Active' | 'Resolved'>('Active')
  const list = reports.filter(r => (tab === 'Active' ? !r.resolved : r.resolved))
  return (
    <div className="scroll no-scrollbar">
      <TopBar title="My Reports" nav={nav} action={<button className="icon-btn" onClick={() => nav.go('report')} aria-label="New report"><Icon name="plus" size={22} /></button>} />
      <div className="tabs">
        {(['Active', 'Resolved'] as const).map(t => (
          <button key={t} className={tab === t ? 'tab-on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="pad">
        {list.length === 0 ? (
          <div className="empty-block">
            <Icon name="ticket" size={32} />
            <strong>No {tab.toLowerCase()} reports</strong>
            <p>{tab === 'Active' ? 'When you submit a concern, you can track it here.' : 'Resolved reports will appear here.'}</p>
            {tab === 'Active' && <button className="btn-primary slim" onClick={() => nav.go('report')}>Report a concern</button>}
          </div>
        ) : list.map(r => (
          <button key={r.id} className="report-list-card" onClick={() => nav.go('tracking', r.id)}>
            <span className="track-icon"><Icon name={r.icon} size={20} /></span>
            <div className="track-body">
              <div className="report-id">{r.id}</div>
              <strong>{r.category}</strong>
              <p>{r.desc}</p>
              <small>{r.date}</small>
            </div>
            <span className={`status-chip ${r.resolved ? 'resolved' : ''}`}>{r.status}</span>
          </button>
        ))}
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

function Tracking({ nav, id, reports }: { nav: Nav; id?: string; reports: Report[] }) {
  const r = reports.find(x => x.id === id) ?? reports[0]
  const last = [...r.timeline].reverse().find(t => t.done)
  return (
    <div className="scroll no-scrollbar">
      <TopBar title="Report Tracking" nav={nav} />
      <div className="pad">
        <div className="ticket-head">
          <span className="ticket-label">TRACKING ID</span>
          <h2>{r.id}</h2>
          <span className={`status-chip ${r.resolved ? 'resolved' : ''}`}>{r.status}</span>
        </div>
        <div className="issue-card">
          <span className="track-icon"><Icon name={r.icon} size={20} /></span>
          <div className="track-body">
            <strong>{r.category}</strong>
            <p>{r.desc}</p>
            <small><Icon name="pin" size={12} /> {r.location} · {r.date}</small>
          </div>
        </div>

        <h3 className="track-heading">Report progress</h3>
        <div className="timeline">
          {r.timeline.map((t, i) => (
            <div key={i} className={`track-step ${t.done ? 'done' : ''} ${t.active ? 'current' : ''}`}>
              <span className="track-dot">{t.done ? <Icon name="check" size={13} /> : t.active ? <i className="pulse" /> : null}</span>
              <div>
                <div className="track-step-head"><strong>{t.title}</strong>{t.done && <small>{t.time}</small>}</div>
                <p>{t.sub}</p>
                {t.office && <span className="office-tag">{t.office}</span>}
              </div>
            </div>
          ))}
        </div>

        {last && (
          <div className="last-update">
            <span className="last-label">LATEST UPDATE</span>
            <p>{last.sub}</p>
            <small>{last.time}</small>
          </div>
        )}
        <button className="btn-bonly" onClick={() => nav.go('chat')}><Bonly size={26} /> Ask Bonly about this report</button>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TALK TO LIBON (Bonly chat)                                          */
/* ------------------------------------------------------------------ */
type Msg = { from: 'bot' | 'user'; text: string; verified?: boolean; actions?: { label: string; go: () => void }[] }
function Chat({ nav }: { nav: Nav }) {
  const greeting: Msg = {
    from: 'bot',
    text: 'Maray na aldaw! I’m Bonly, your Libon AI Agent. Ano ang maitutulong ko?',
  }
  const [msgs, setMsgs] = useState<Msg[]>([greeting])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const scrollDown = () => requestAnimationFrame(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight })

  const reply = (text: string): Msg => {
    const t = text.toLowerCase()
    if (/(streetlight|sira|ilaw|report|basura|flood|baha|pothole|kalsada)/.test(t))
      return { from: 'bot', text: 'I can help you prepare a report. I’ll guide you through choosing a category, describing the issue, and confirming the location before you submit.', actions: [{ label: 'Start a report', go: () => nav.go('report') }] }
    if (/(dental|extraction|ngipin|rhu|health|clinic|doktor)/.test(t))
      return { from: 'bot', text: 'Yes — the Rural Health Unit offers free dental consultations and tooth extractions on weekday mornings, 8:00 AM–12:00 NN. Bring any valid ID.', verified: true, actions: [{ label: 'View Health Services', go: () => nav.go('serviceDetail', 'dental') }] }
    if (/(permit|business|negosyo|license)/.test(t))
      return { from: 'bot', text: 'For a business permit, you’ll need your DTI/SEC registration, barangay clearance, and proof of address. Processing usually takes 5–7 working days at the BPLO.', verified: true, actions: [{ label: 'Business Permit info', go: () => nav.go('serviceDetail', 'business') }] }
    if (/(emergency|tulong|911|ambulance|fire|police|pulis)/.test(t))
      return { from: 'bot', text: 'For emergencies, please contact the right office directly. Here are Libon’s verified emergency contacts.', actions: [{ label: 'View emergency contacts', go: () => nav.go('help') }] }
    if (/(explore|place|food|kain|tourist|lugar)/.test(t))
      return { from: 'bot', text: 'Libon has plenty to discover — from Lake Danao Viewdeck to local markets and homegrown cafés. Want to browse verified local listings?', actions: [{ label: 'Explore Libon', go: () => nav.go('explore') }] }
    if (/(scholar|aral|educ|opportunit|program)/.test(t))
      return { from: 'bot', text: 'The municipal scholarship program is currently accepting applications for qualified student residents.', verified: true, actions: [{ label: 'View program', go: () => nav.go('updateDetail', 'u3') }] }
    return { from: 'bot', text: 'I specialize in Libon municipal services, information, local assistance, and reporting. Here are a few things I can help with.', actions: [{ label: 'Find a service', go: () => nav.go('services') }, { label: 'Emergency contacts', go: () => nav.go('help') }] }
  }

  const send = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    setMsgs(m => [...m, { from: 'user', text: clean }])
    setInput('')
    scrollDown()
    setTimeout(() => { setMsgs(m => [...m, reply(clean)]); scrollDown() }, 450)
  }

  // Camera in chat: an attached photo is treated as a possible municipal
  // concern — Bonly guides the resident into the report workflow rather than
  // submitting anything on its own.
  const attachPhoto = () => {
    setMsgs(m => [...m, { from: 'user', text: '📷 Photo attached' }])
    scrollDown()
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'bot', text: 'Thanks for the photo. If this shows a concern like a broken streetlight, flooding or uncollected waste, I can help you turn it into an official report. You’ll confirm the category, description and location before anything is submitted.', actions: [{ label: 'Start a report', go: () => nav.go('report') }] }])
      scrollDown()
    }, 450)
  }

  // Suggestions collapse once the conversation starts.
  const shortSuggestions = ['Find a service', 'Report a concern', 'Emergency contacts']
  const longSuggestions = ['May dental extraction ba sa RHU?', 'Sira po ang streetlight dito.']

  return (
    <div className="chat-screen">
      <header className="chat-head">
        <button className="icon-btn" onClick={nav.back} aria-label="Back"><Icon name="back" size={22} /></button>
        <div className="chat-identity">
          <img src="/src/assets/bonly-icon.png" alt="Bonly" className="chat-bonly-avatar" />
          <div>
            <strong>Talk to Bonly</strong>
            <span><i className="live" /> Municipal AI Agent</span>
          </div>
        </div>
      </header>

      <div className="chat-body no-scrollbar" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`bubble-wrap ${m.from}`}>
            <div className="bubble-row">
              {m.from === 'bot' && <img src="/src/assets/bonly-icon.png" alt="Bonly" className="bot-avatar" />}
              <div className={`bubble ${m.from}`}>
                {m.text}
                {m.verified && <span className="verified-tag"><Icon name="shield" size={12} /> Verified municipal information · Updated Sep 2026</span>}
              </div>
            </div>
            {m.actions && (
              <div className="bubble-actions">
                {m.actions.map((a, j) => <button key={j} onClick={a.go}>{a.label} <Icon name="arrow" size={14} /></button>)}
              </div>
            )}
          </div>
        ))}
        {msgs.length === 1 && (
          <div className="suggest-wrap">
            <p className="suggest-label">SUGGESTED</p>
            <div className="suggest-pills">
              {shortSuggestions.map(s => <button key={s} className="suggest-pill" onClick={() => send(s)}>{s}</button>)}
            </div>
            {longSuggestions.map(s => <button key={s} className="suggest-row" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
      </div>

      {listening ? (
        <div className="chat-listening">
          <span className="listening-orb"><Icon name="mic" size={20} /></span>
          <div className="listening-wave"><i /><i /><i /><i /><i /></div>
          <span className="listening-label">Listening…</span>
          <button type="button" className="listening-cancel" onClick={() => setListening(false)}>Cancel</button>
        </div>
      ) : (
        <form className="chat-input" onSubmit={e => { e.preventDefault(); send(input) }}>
          <button type="button" className="in-icon" aria-label="Voice input" onClick={() => setListening(true)}><Icon name="mic" size={20} /></button>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Message Bonly…" />
          <button type="button" className="in-icon" aria-label="Camera" onClick={attachPhoto}><Icon name="camera" size={20} /></button>
          <button type="submit" className={`send-btn ${input.trim() ? 'ready' : ''}`} disabled={!input.trim()} aria-label="Send"><Icon name="send" size={18} /></button>
        </form>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EXPLORE                                                             */
/* ------------------------------------------------------------------ */
function Explore({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const ql = q.trim().toLowerCase()
  const list = PLACES.filter(p => (cat === 'All' || p.cat === cat) && (!ql || (p.name + p.brgy).toLowerCase().includes(ql)))
  return (
    <div className="scroll no-scrollbar">
      <div className="plain-head">
        <h1>Explore Libon</h1>
        <p>Discover verified local places, food and products.</p>
        <div className="search-field embedded">
          <Icon name="search" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search places, food, products…" />
        </div>
      </div>
      <div className="sticky-chips"><Chips items={EXPLORE_FILTERS} value={cat} onChange={setCat} /></div>
      <div className="pad">
        {list.length === 0 && <div className="empty-block"><Icon name="map" size={30} /><p>No listings in this category yet.</p></div>}
        {list.map(p => (
          <button key={p.id} className="place-card" onClick={() => nav.go('exploreDetail', p.id)}>
            <Photo src={imgUrl(p.photo, 220, 220)} alt={p.alt} icon={p.icon} className="place-thumb" />
            <div className="place-text">
              <span className="verified-badge"><Icon name="check" size={12} /> Verified Listing</span>
              <strong>{p.name}</strong>
              <small>{p.cat} · {p.brgy}</small>
            </div>
            <Icon name="chevron" size={18} />
          </button>
        ))}
        <div className="scroll-pad" />
      </div>
    </div>
  )
}
function ExploreDetail({ nav, id }: { nav: Nav; id?: string }) {
  const p = PLACES.find(x => x.id === id) ?? PLACES[0]
  return (
    <div className="scroll no-scrollbar">
      <div className="detail-cover">
        <Photo src={imgUrl(p.photo, 900, 600)} alt={p.alt} icon={p.icon} className="cover-photo" />
        <button className="icon-btn floating" onClick={nav.back} aria-label="Back"><Icon name="back" size={22} /></button>
      </div>
      <div className="pad">
        <span className="verified-badge"><Icon name="check" size={12} /> Verified Listing</span>
        <h2 className="explore-title">{p.name}</h2>
        <p className="explore-meta">{p.cat} · {p.brgy}</p>
        <p className="explore-desc">{p.desc}</p>
        <div className="info-card">
          <div><Icon name="clock" size={16} /><span>{p.hours}</span></div>
          <div><Icon name="pin" size={16} /><span>{p.brgy}, Libon, Albay</span></div>
          <div><Icon name="phone" size={16} /><span>{p.contact}</span></div>
        </div>
        <button className="btn-primary"><Icon name="map" size={18} /> Get directions</button>
        <button className="btn-outline"><Icon name="info" size={16} /> Report incorrect information</button>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* UPDATES                                                             */
/* ------------------------------------------------------------------ */
function Updates({ nav, initialFilter }: { nav: Nav; initialFilter?: string }) {
  const [f, setF] = useState(initialFilter || 'All')
  const list = UPDATES.filter(u => f === 'All' || u.type === f)
  return (
    <div className="scroll no-scrollbar">
      <div className="plain-head">
        <h1>Updates</h1>
        <p>Official advisories, programs and announcements.</p>
      </div>
      <div className="sticky-chips"><Chips items={UPDATE_FILTERS} value={f} onChange={setF} /></div>
      <div className="pad">
        {list.length === 0 && <div className="empty-block"><Icon name="megaphone" size={30} /><p>No updates in this category.</p></div>}
        {list.map(u => (
          <button key={u.id} className="update-card" onClick={() => nav.go('updateDetail', u.id)}>
            {u.photo && <Photo src={imgUrl(u.photo, 700, 350)} alt={u.photoAlt || u.title} icon="megaphone" className="update-card-photo" />}
            <div className="update-card-content">
              <div className="update-card-top">
                <span className={`u-tag t-${u.type.toLowerCase()}`}>{u.label}</span>
                <small>{u.date}</small>
              </div>
              <strong>{u.title}</strong>
              <p>{u.preview}</p>
              <span className="update-office">{u.office}</span>
            </div>
          </button>
        ))}
        <div className="scroll-pad" />
      </div>
    </div>
  )
}
function UpdateDetail({ nav, id }: { nav: Nav; id?: string }) {
  const u = UPDATES.find(x => x.id === id) ?? UPDATES[0]
  return (
    <div className="scroll no-scrollbar">
      <TopBar title="Announcement" nav={nav} />
      <div className="pad">
        {u.photo && (
          <div className="update-hero-photo">
            <Photo src={imgUrl(u.photo, 800, 480)} alt={u.photoAlt || u.title} icon="megaphone" className="update-cover" />
          </div>
        )}
        <span className={`u-tag t-${u.type.toLowerCase()}`}>{u.label}</span>
        <h2 className="update-title">{u.title}</h2>
        <p className="update-byline">{u.office} · {u.date}</p>
        <span className="official-tag"><Icon name="shield" size={13} /> Official municipal update</span>
        <div className="divider" />
        <p className="article">{u.body}</p>
        <p className="article">For further clarification, residents may visit the concerned office during working hours or contact them through the LibON Help directory.</p>
        <button className="btn-bonly" onClick={() => nav.go('chat')}><Bonly size={26} /> Ask Bonly about this</button>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* HELP                                                                */
/* ------------------------------------------------------------------ */
function Help({ nav, section }: { nav: Nav; section?: string }) {
  const isOffices = section === 'offices'
  return (
    <div className="scroll no-scrollbar">
      <div className="plain-head">
        <h1>{isOffices ? 'Municipal Offices Directory' : 'Help & Essential Contacts'}</h1>
        <p>{isOffices ? 'Verified office locations, hours, and official contacts.' : 'For emergencies, always contact the official office directly.'}</p>
      </div>
      <div className="pad">
        {!isOffices && (
          <>
            <div className="emergency-banner">
              <span><Icon name="phone" size={18} /> Emergency Hotline</span>
              <a className="call-lg" href="tel:911">911</a>
            </div>
            <p className="group-label">EMERGENCY</p>
            {EMERGENCY.map(c => <ContactRow key={c.id} c={c} emphasis />)}
          </>
        )}
        <p className="group-label">{isOffices ? 'MUNICIPAL OFFICES' : 'MUNICIPAL CONTACTS'}</p>
        {OFFICES.map(c => <ContactRow key={c.id} c={c} nav={nav} />)}
        {isOffices && (
          <>
            <p className="group-label">EMERGENCY CONTACTS</p>
            {EMERGENCY.map(c => <ContactRow key={c.id} c={c} emphasis nav={nav} />)}
          </>
        )}
        <button className="btn-bonly" onClick={() => nav.go('chat')}><Bonly size={26} /> Ask Bonly about an office</button>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}
function ContactRow({ c, emphasis, nav }: { c: Contact; emphasis?: boolean; nav?: Nav }) {
  return (
    <div className={`contact-row ${emphasis ? 'emph' : ''}`}>
      <span className="mini-icon"><Icon name={c.icon} size={19} /></span>
      <div>
        <strong>{c.name}</strong>
        <small>{c.sub}</small>
        <span className="contact-meta">Mon–Fri 8:00 AM – 5:00 PM ·<br />Municipal Hall</span>
      </div>
      <a className="call-btn" href={`tel:${c.number.replace(/[^0-9]/g, '')}`}><Icon name="phone" size={15} /> Call</a>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* MORE                                                                */
/* ------------------------------------------------------------------ */
function More({ nav }: { nav: Nav }) {
  const groups: { label: string; items: { icon: IconName; title: string; sub: string; go?: () => void }[] }[] = [
    { label: 'DISCOVER & CONNECT', items: [
      { icon: 'leaf', title: 'Explore Libon', sub: 'Local places, food & products', go: () => nav.go('explore') },
      { icon: 'megaphone', title: 'Updates', sub: 'Advisories, programs & events', go: () => nav.go('updates') },
      { icon: 'phone', title: 'Help & Emergency Contacts', sub: 'Hotlines and office directory', go: () => nav.go('help') },
      { icon: 'ticket', title: 'My Reports', sub: 'Track your submitted concerns', go: () => nav.go('myReports') },
    ]},
    { label: 'SETTINGS', items: [
      { icon: 'briefcase', title: 'Municipal Offices', sub: 'Directory of LGU offices', go: () => nav.go('help') },
      { icon: 'shield', title: 'Privacy & Data', sub: 'How your information is used' },
      { icon: 'accessibility', title: 'Accessibility', sub: 'Text size & contrast' },
      { icon: 'globe', title: 'Language', sub: 'English · Filipino' },
      { icon: 'info', title: 'About LibON', sub: 'Libon digitally ON' },
    ]},
  ]
  return (
    <div className="scroll no-scrollbar">
      <div className="plain-head"><h1>More</h1></div>
      <div className="pad">
        <div className="profile">
          <span className="avatar">JC</span>
          <div><strong>John Carlo Nas</strong><small>Resident of Burabod, Libon, Albay</small></div>
          <button className="link-btn">Edit</button>
        </div>
        <div className="profile-stats">
          <button onClick={() => nav.go('myReports')}><b>1</b><span>Active report</span></button>
          <div className="stat-div" />
          <button onClick={() => nav.go('services')}><b>4</b><span>Saved services</span></button>
        </div>
        {groups.map(g => (
          <div key={g.label}>
            <p className="group-label">{g.label}</p>
            <div className="menu-group">
              {g.items.map(it => (
                <button key={it.title} className="menu-row" onClick={it.go}>
                  <span className="mini-icon sm"><Icon name={it.icon} size={18} /></span>
                  <div><strong>{it.title}</strong><small>{it.sub}</small></div>
                  <Icon name="chevron" size={17} />
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="version">LibON · v1.0.0 · <span>Libon digitally ON</span></p>
        <div className="scroll-pad" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* BOTTOM NAV                                                          */
/* ------------------------------------------------------------------ */
function BottomNav({ activeTab, nav }: { activeTab: string; nav: Nav }) {
  const items: { label: string; icon: IconName; screen: ScreenName }[] = [
    { label: 'Home', icon: 'home', screen: 'home' },
    { label: 'Services', icon: 'grid', screen: 'services' },
    { label: 'Report', icon: 'flag', screen: 'report' },
    { label: 'More', icon: 'more', screen: 'more' },
  ]
  return (
    <nav className="bottom-nav">
      <button className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => nav.go('home')}>
        <Icon name="home" size={23} filled={activeTab === 'Home'} /><span>Home</span>
      </button>
      <button className={`nav-item ${activeTab === 'Services' ? 'active' : ''}`} onClick={() => nav.go('services')}>
        <Icon name="grid" size={23} filled={activeTab === 'Services'} /><span>Services</span>
      </button>

      <button className={`nav-bonly ${activeTab === 'Bonly' ? 'active' : ''}`} onClick={() => nav.go('chat')} aria-label="Talk to Bonly">
        <img src="/src/assets/bonly-icon.png" alt="Bonly" className={`bonly-nav-img ${activeTab === 'Bonly' ? 'on' : ''}`} />
      </button>

      <button className={`nav-item ${activeTab === 'Report' ? 'active' : ''}`} onClick={() => nav.go('report')}>
        <Icon name="flag" size={23} filled={activeTab === 'Report'} /><span>Report</span>
      </button>
      <button className={`nav-item ${activeTab === 'More' ? 'active' : ''}`} onClick={() => nav.go('more')}>
        <Icon name="more" size={23} filled={activeTab === 'More'} /><span>More</span>
      </button>
    </nav>
  )
}

function StatusBar() {
  return (
    <div className="statusbar" aria-label="Device status">
      <time dateTime="09:41">9:41</time>
      <div className="status-icons" aria-hidden="true">
        <span className="bars"><i /><i /><i /><i /></span>
        <svg className="wifi" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path d="M1.5 4.5a11.5 11.5 0 0 1 15 0M4.5 7.5a7 7 0 0 1 9 0M7.5 10.5a2.5 2.5 0 0 1 3 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="12.5" r="1" fill="currentColor" />
        </svg>
        <span className="battery" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* APP ROOT                                                            */
/* ------------------------------------------------------------------ */
export default function App() {
  const [stack, setStack] = useState<Route[]>([{ screen: 'home' }])
  const [reports, setReports] = useState<Report[]>([seedReport])
  const [ticketSeq, setTicketSeq] = useState(147)

  const current = stack[stack.length - 1]
  const nav: Nav = {
    go: (screen, param) => {
      // Tapping a primary tab resets to that root; detail screens push.
      // Talk to Libon is a focused overlay-style destination. Unlike the
      // persistent tabs, it must retain its origin so its header back button
      // can return residents to the service, report, or tab they came from.
      const isRoot = ['home', 'services', 'report', 'more'].includes(screen) && !param
      setStack(s => (isRoot ? [{ screen, param }] : [...s, { screen, param }]))
    },
    back: () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)),
    canBack: stack.length > 1,
  }

  const submitReport = (d: Draft) => {
    const id = `LIB-2026-0${ticketSeq}`
    setTicketSeq(n => n + 1)
    const newReport: Report = {
      id, category: d.category, icon: d.icon, desc: d.desc, location: d.location, date: 'Sep 25, 2026', status: 'Assigned', resolved: false,
      timeline: [
        { title: 'Submitted', sub: 'Your report has been received by LibON.', time: 'Sep 25, 8:42 PM', done: true },
        { title: 'Received', sub: 'Validated by the Municipal Helpdesk.', time: 'Sep 25, 8:50 PM', done: true },
        { title: 'Assigned', sub: 'Your concern has been assigned for verification.', office: 'Municipal Infrastructure / Maintenance', time: 'Sep 25, 9:15 PM', done: true, active: false },
        { title: 'Action Taken', sub: 'The assigned office will update this once work begins.', time: 'Pending', done: false, active: true },
        { title: 'Resolved', sub: 'You’ll be notified when your concern is resolved.', time: 'Pending', done: false },
      ],
    }
    setReports(r => [newReport, ...r])
    setStack(s => [...s, { screen: 'reportSuccess', param: id }])
  }

  const activeTab = TAB_OF[current.screen] ?? 'Home'
  // Talk to Libon is a focused full-screen conversation — the global bottom
  // navigation is hidden so the message composer owns the bottom of the screen.
  const showNav = !['search', 'reportSuccess', 'chat'].includes(current.screen)

  const screen = useMemo(() => {
    switch (current.screen) {
      case 'home': return <Home nav={nav} reports={reports} />
      case 'notifications': return <Notifications nav={nav} />
      case 'search': return <Search nav={nav} />
      case 'services': return <Services nav={nav} />
      case 'serviceDetail': return <ServiceDetail nav={nav} id={current.param} />
      case 'report': return <ReportFlow nav={nav} submit={submitReport} />
      case 'reportSuccess': return <ReportSuccess nav={nav} id={current.param} />
      case 'myReports': return <MyReports nav={nav} reports={reports} />
      case 'tracking': return <Tracking nav={nav} id={current.param} reports={reports} />
      case 'chat': return <Chat nav={nav} />
      case 'explore': return <Explore nav={nav} />
      case 'exploreDetail': return <ExploreDetail nav={nav} id={current.param} />
      case 'updates': return <Updates nav={nav} initialFilter={current.param} />
      case 'updateDetail': return <UpdateDetail nav={nav} id={current.param} />
      case 'help': return <Help nav={nav} section={current.param} />
      case 'more': return <More nav={nav} />
      default: return <Home nav={nav} reports={reports} />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack, reports])

  return (
    <div className="app-frame">
      <div className="device-shell">
        <span className="device-button device-action" aria-hidden="true" />
        <span className="device-button device-volume-up" aria-hidden="true" />
        <span className="device-button device-volume-down" aria-hidden="true" />
        <span className="device-button device-power" aria-hidden="true" />
        <span className="device-island" aria-hidden="true"><i /></span>
        <div className="app">
          <StatusBar />
          <div className="viewport">{screen}</div>
          {showNav && <BottomNav activeTab={activeTab} nav={nav} />}
          <div className="home-indicator" aria-hidden="true"><span /></div>
        </div>
      </div>
    </div>
  )
}
