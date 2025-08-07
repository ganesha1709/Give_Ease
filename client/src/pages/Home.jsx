import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Heart, 
  Shield, 
  UserCheck, 
  ArrowRightLeft, 
  Medal, 
  Award, 
  Crown, 
  Download,
  HandHeart,
  Users,
  Building,
  Plus,
  Search,
  Check
} from 'lucide-react';

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchOnWindowFocus: false,
  });

  const { data: featuredItems } = useQuery({
    queryKey: ['/api/items'],
    select: (data) => data?.slice(0, 3) || [],
    refetchOnWindowFocus: false,
  });

  const categories = [
    { name: 'Clothes', icon: '👕', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    { name: 'Books', icon: '📚', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
    { name: 'Furniture', icon: '🛋️', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    { name: 'Toys', icon: '🧸', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
    { name: 'Kitchen', icon: '🍴', color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  ];

  const badges = [
    {
      name: 'Bronze Giver',
      icon: Medal,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      textColor: 'text-orange-600',
      range: '1-4 successful donations',
      description: 'Start your giving journey and make your first impact in the community'
    },
    {
      name: 'Silver Champion',
      icon: Award,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20',
      textColor: 'text-gray-600',
      range: '5-9 successful donations',
      description: 'Become a regular contributor and inspire others to give back'
    },
    {
      name: 'Gold Hero',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
      textColor: 'text-yellow-600',
      range: '10+ successful donations',
      description: 'Join the elite circle of community heroes making lasting change'
    }
  ];

  const roles = [
    {
      title: 'I Want to Donate',
      description: 'Share your unused items with those who need them',
      icon: HandHeart,
      color: 'primary',
      features: ['List items easily', 'Track delivery status', 'Earn recognition badges', 'Get impact certificates'],
      action: 'Start Donating',
      link: '/register'
    },
    {
      title: 'I Need Items',
      description: 'Find items that can help improve your situation',
      icon: Users,
      color: 'secondary',
      features: ['Browse verified donations', 'Smart matching system', 'Direct communication', 'Secure verification'],
      action: 'Browse Items',
      link: '/browse'
    },
    {
      title: 'NGO Partner',
      description: 'Scale your impact by connecting with our community',
      icon: Building,
      color: 'accent',
      features: ['Bulk donation management', 'Priority matching', 'Impact reporting', 'Verification support'],
      action: 'Partner With Us',
      link: '/register'
    }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="pt-8 pb-16 bg-gradient-to-br from-gray-50 via-emerald-50 to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  <Shield className="mr-2 h-4 w-4" />
                  Verified & Trusted Platform
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Simplify{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Giving
                  </span>
                  ,<br />
                  Amplify{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Impact
                  </span>
                </h1>
                <p className="text-xl text-neutral dark:text-gray-300 leading-relaxed">
                  Connect verified donors with recipients and NGOs. Transform unused items into meaningful impact through our secure, transparent donation platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/add-donation">
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Plus className="mr-2 h-5 w-5" />
                    Start Donating
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold">
                    <Search className="mr-2 h-5 w-5" />
                    Browse Items
                  </Button>
                </Link>
              </div>
              
              {stats && (
                <div className="flex items-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalDonations.toLocaleString()}</div>
                    <div className="text-sm text-neutral dark:text-gray-400">Items Donated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.verifiedUsers.toLocaleString()}</div>
                    <div className="text-sm text-neutral dark:text-gray-400">Verified Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.ngoPartners.toLocaleString()}</div>
                    <div className="text-sm text-neutral dark:text-gray-400">NGO Partners</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Card className="p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.name} className={`${category.color} rounded-xl p-4 text-center`}>
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="text-sm font-medium">{category.name}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">GiveEase</span> Works
            </h2>
            <p className="text-xl text-neutral dark:text-gray-300 max-w-2xl mx-auto">
              Our streamlined process ensures secure, verified donations reach those who need them most
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <UserCheck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">Join & Select Role</h3>
              <p className="text-neutral dark:text-gray-300">
                Create your account and choose how you want to participate - as a donor, recipient, or NGO partner.
              </p>
              <div className="text-sm text-primary font-medium">Quick Signup • Instant Access • Role Selection</div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-blue-400 rounded-full flex items-center justify-center mx-auto">
                <ArrowRightLeft className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">Give or Receive</h3>
              <p className="text-neutral dark:text-gray-300">
                List items you want to donate or browse available donations. Our matching system connects the right people.
              </p>
              <div className="text-sm text-secondary font-medium">Smart Matching • Category Filters • Location-Based</div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">Track Impact</h3>
              <p className="text-neutral dark:text-gray-300">
                See your donation's journey with proof of delivery. Earn badges and certificates for your contributions.
              </p>
              <div className="text-sm text-red-600 font-medium">Delivery Proof • Achievement Badges • Impact Certificates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Donations */}
      {featuredItems && featuredItems.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Recent <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Donations</span>
              </h2>
              <p className="text-xl text-neutral dark:text-gray-300">
                See the latest items shared by our generous community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                      <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-neutral dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {item.donor?.firstName?.[0] || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {item.donor ? `${item.donor.firstName} ${item.donor.lastName[0]}.` : 'Unknown'}
                        </span>
                        {item.donor?.badgeLevel !== 'none' && (
                          <Badge variant="outline" size="sm">
                            {item.donor.badgeLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/browse">
                <Button size="lg">
                  View All Donations
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gamification */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Earn <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Recognition</span>
            </h2>
            <p className="text-xl text-neutral dark:text-gray-300">
              Get rewarded for your generosity with badges, certificates, and community recognition
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`text-center p-8 bg-gradient-to-br ${badge.bgColor} rounded-2xl`}
                >
                  <div className={`w-24 h-24 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white text-3xl" />
                  </div>
                  <h3 className={`text-2xl font-bold ${badge.textColor} mb-2`}>{badge.name}</h3>
                  <p className={`${badge.textColor} dark:text-opacity-80 mb-4`}>{badge.range}</p>
                  <div className="text-sm text-neutral dark:text-gray-300">
                    {badge.description}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Digital Certificates</h3>
            <p className="text-neutral dark:text-gray-300 mb-6">
              Receive downloadable PDF certificates for each donation. Share your impact on social media and build your giving portfolio.
            </p>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Sample Certificate
            </Button>
          </div>
        </div>
      </section>

      {/* Role-based CTAs */}
      <section id="roles" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Role</span>
            </h2>
            <p className="text-xl text-neutral dark:text-gray-300">
              Whether you're giving, receiving, or representing an organization - there's a place for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.title} className="p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${
                      role.color === 'primary' ? 'bg-primary' : 
                      role.color === 'secondary' ? 'bg-blue-500' : 'bg-red-500'
                    } rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <h3 className={`text-2xl font-bold ${
                      role.color === 'primary' ? 'text-primary' : 
                      role.color === 'secondary' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {role.title}
                    </h3>
                    <p className="text-neutral dark:text-gray-300 mt-2">{role.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className={`${
                          role.color === 'primary' ? 'text-primary' : 
                          role.color === 'secondary' ? 'text-blue-500' : 'text-red-500'
                        } mr-3 h-4 w-4`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={role.link}>
                    <Button 
                      className={`w-full ${
                        role.color === 'secondary' ? 'bg-blue-500 hover:bg-blue-600' : 
                        role.color === 'accent' ? 'bg-red-500 hover:bg-red-600' : ''
                      }`}
                    >
                      {role.action}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
