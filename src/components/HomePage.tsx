import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ArrowRight,
  Globe,
  Camera,
  Heart,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { usePopularDestinations, useToggleFavorite } from '../hooks/useDestinations';
import ErrorMessage from './ErrorMessage';
import AuthModal from './AuthModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    data: destinationsData,
    loading: destinationsLoading,
    error: destinationsError,
    refetch
  } = usePopularDestinations(3);

  const toggleFavoriteMutation = useToggleFavorite();

  const handleToggleFavorite = async (destinationId: string) => {
    try {
      await toggleFavoriteMutation.mutate(destinationId);
      refetch();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Trippy</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <span className="text-gray-600 hover:text-primary-600 cursor-pointer">
                Destinations
              </span>
              <button
                onClick={() => navigate('/plan')}
                className="text-gray-600 hover:text-primary-600 bg-transparent border-none cursor-pointer"
              >
                Plans
              </button>
              <span className="text-gray-600 hover:text-primary-600 cursor-pointer">
                About
              </span>
              <span className="text-gray-600 hover:text-primary-600 cursor-pointer">
                Contact
              </span>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                className="btn-secondary"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/plan')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
              {' '}Trip
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover amazing destinations, create custom itineraries, and make unforgettable memories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/plan')}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
            >
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
              <Camera className="mr-2 h-5 w-5" />
              Explore Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Trippy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with travel expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart Recommendations</h3>
              <p className="text-gray-600">
                Personalized destination suggestions based on your interests.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Detailed Itineraries</h3>
              <p className="text-gray-600">
                Day-by-day plans with activities, food, and attractions.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Group Planning</h3>
              <p className="text-gray-600">
                Collaborate with friends and family in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600">
              Discover the most loved places around the world
            </p>
          </div>

          {destinationsError && (
            <ErrorMessage error={destinationsError} onRetry={refetch} />
          )}

          {destinationsData?.data && (
            <div className="grid md:grid-cols-3 gap-8">
              {destinationsData.data.map(destination => (
                <div
                  key={destination.id}
                  className="card overflow-hidden cursor-pointer hover:shadow-lg"
                  onClick={() => navigate('/plan')}
                >
                  <div
                    className="relative h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${destination.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20" />
                    <button
                      className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(destination.id);
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          destination.isFavorite
                            ? 'text-red-400 fill-red-400'
                            : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-gray-600 my-2">{destination.description}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">
                        {destination.rating.toFixed(1)} (
                        {destination.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!destinationsLoading &&
            (!destinationsData?.data || destinationsData.data.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-600">No destinations available.</p>
              </div>
            )}
        </div>
      </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of travelers who have discovered their perfect trips with Trippy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Create Free Account
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200 text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold">Trippy</span>
              </div>
              <p className="text-gray-400">
                Making travel planning simple, smart, and unforgettable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Trippy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default HomePage;
