import { createService } from '../src/services/serviceService'

const initialServices = [
  {
    name: 'Paver Installation',
    description: 'Professional installation of various types of pavers for driveways, patios, and walkways.',
    price: 'Starting at $12/sq ft',
    link: '/services/paver-installation',
    details: 'Includes site preparation, base installation, paver laying, and finishing touches.'
  },
  {
    name: 'Concrete Work',
    description: 'Custom concrete solutions for driveways, patios, and decorative concrete features.',
    price: 'Starting at $8/sq ft',
    link: '/services/concrete-work',
    details: 'Includes formwork, pouring, finishing, and curing.'
  },
  {
    name: 'Retaining Walls',
    description: 'Design and construction of functional and decorative retaining walls.',
    price: 'Starting at $45/sq ft',
    link: '/services/retaining-walls',
    details: 'Includes engineering, drainage, and construction.'
  },
  {
    name: 'Outdoor Kitchens',
    description: 'Custom outdoor kitchen design and installation.',
    price: 'Starting at $15,000',
    link: '/services/outdoor-kitchens',
    details: 'Includes design, construction, and appliance installation.'
  },
  {
    name: 'Landscaping',
    description: 'Complete landscape design and installation services.',
    price: 'Custom Quote',
    link: '/services/landscaping',
    details: 'Includes design, plant selection, irrigation, and installation.'
  }
]

async function main() {
  try {
    for (const service of initialServices) {
      const createdService = await createService(service)
      console.log('Successfully added service:', createdService.name)
    }
    console.log('All services have been added successfully!')
  } catch (error) {
    console.error('Failed to add services:', error)
  }
}

main() 