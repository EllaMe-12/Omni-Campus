
export const upcomingEventsData = [
  {
    id: 1,
    title: 'FutureTech Summit 2026',
    organizer: 'Edward College of Engineering',
    partner: 'Kamothe Institute of Technology',
    venue: 'Main Auditorium, Edward College of Engineering',
    location: 'Parel, Mumbai',
    date: '2026-11-20',
    time: '10:00 AM – 5:00 PM'
  },
  {
    id: 2,
    title: 'Robotics Championship',
    organizer: 'Panvel College of Engineering & Innovation',
    partner: null,
    venue: 'Robotics Arena',
    location: 'New Panvel, Navi Mumbai',
    date: '2026-12-12',
    time: '9:30 AM – 4:30 PM'
  },
  {
    id: 3,
    title: 'CodeFest 2027 — Inter-College Hackathon',
    organizer: 'Kharghar Institute of Advanced Studies',
    partner: 'Edward College of Engineering',
    venue: 'Innovation Centre',
    location: 'Kharghar, Navi Mumbai',
    date: '2027-01-18',
    time: '9:00 AM – 6:00 PM'
  },
  {
    id: 4,
    title: 'Annual Cultural Fest 2027',
    organizer: 'Edward College of Engineering',
    partner: null,
    venue: 'College Open Ground',
    location: 'Parel, Mumbai',
    date: '2027-02-14',
    time: '10:00 AM – 7:00 PM'
  },
  {
    id: 5,
    title: 'AI Innovation Expo',
    organizer: 'Navi Mumbai College of Arts & Technology',
    partner: null,
    venue: 'Exhibition Hall',
    location: 'CBD Belapur, Navi Mumbai',
    date: '2027-03-10',
    time: '10:30 AM – 5:00 PM'
  },
  {
    id: 6,
    title: 'Inter-College Sports Meet',
    organizer: 'Edward College of Engineering',
    partner: 'Panvel College of Engineering & Innovation',
    venue: 'Sports Complex',
    location: 'Kamothe, Navi Mumbai',
    date: '2027-04-16',
    time: '8:00 AM – 5:00 PM'
  }
]

export function parseEventDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatEventDate(dateString) {
  return parseEventDate(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function getUpcomingEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  endDate.setMonth(endDate.getMonth() + 6)

  return upcomingEventsData
    .filter((event) => {
      const date = parseEventDate(event.date)
      return date > today && date <= endDate
    })
    .sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date))
}
