import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ArrowRight,
  Globe,
  Camera,
  Heart
} from 'lucide-react';
import { usePopularDestinations, useToggleFavorite } from '../hooks/useDestinations';
import ErrorMessage from './ErrorMessage';
import AuthModal from './AuthModal' ;

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

  const handleToggleFavorite = async (location: string) => {
    try {
      await toggleFavoriteMutation.mutate(location);
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
              <a className="text-gray-600 hover:text-primary-600 cursor-pointer">Destinations</a>
              <button
                onClick={() => navigate('/plan')}
                className="text-gray-600 hover:text-primary-600 bg-transparent border-none cursor-pointer"
              >
                Plans
              </button>
              <a className="text-gray-600 hover:text-primary-600 cursor-pointer">About</a>
              <a className="text-gray-600 hover:text-primary-600 cursor-pointer">Contact</a>
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

      {/* Hero */}
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

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most loved places around the world
            </p>
          </div>

          {destinationsError && (
            <div className="max-w-md mx-auto">
              <ErrorMessage error={destinationsError} onRetry={refetch} />
            </div>
          )}

          {destinationsData?.data && (
            <div className="grid md:grid-cols-3 gap-8">
              {destinationsData.data.map(destination => (
                <div
                  key={destination.id}
                  className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/plan')}
                >
                  <div
                    className="relative h-64"
                    style={{
                      backgroundImage: destination.imageUrl
                        ? `url(${destination.imageUrl})`
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20" />
                    <div className="absolute top-4 right-4">
                      <button
                        className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2"
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
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">
                        {destination.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">
                          {destination.rating.toFixed(1)} (
                          {destination.reviewCount.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {destination.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        ${destination.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!destinationsLoading &&
            !destinationsError &&
            (!destinationsData?.data || destinationsData.data.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No popular destinations available.
                </p>
                <button onClick={refetch} className="mt-4 btn-primary">
                  Refresh
                </button>
              </div>
            )}
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default HomePage;
