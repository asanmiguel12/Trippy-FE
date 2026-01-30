import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserTrips, useCreateTrip } from '../hooks/useTrips';
import { useDestinations } from '../hooks/useDestinations';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { CreateTripRequest, Activity } from '../types/api';
import TripMap from './TripMap';

const PlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [activities, setActivities] = useState<Omit<Activity, 'id'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitInProgressRef = useRef(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { data: tripsData, loading: tripsLoading, error: tripsError, refetch } = useUserTrips();
  const { data: destinationsData } = useDestinations();
  const createTripMutation = useCreateTrip();
  const userTrips = tripsData ?? [];

  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tripsArray = Array.isArray(userTrips) ? userTrips : [];
  const totalPages = Math.ceil(tripsArray.length / ITEMS_PER_PAGE);

  const paginatedTrips = tripsArray.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Debug: Log the data to see what's happening
  console.log('PlanPage - tripsData:', tripsData);
  console.log('PlanPage - tripsLoading:', tripsLoading);
  console.log('PlanPage - tripsError:', tripsError);

  useEffect(() => {
    console.log('[PlanPage] tripsData changed:', tripsData);
  }, [tripsData]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isPublic: false,
  });

  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    cost: 0,
    location: '',
    type: 'attraction' as const,
    isPublic: false,
  });

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (submitInProgressRef.current) {
      return;
    }
  
    submitInProgressRef.current = true;
    setIsSubmitting(true);
  
    const warmupTimer = setTimeout(() => {
      if (submitInProgressRef.current) {
        setLoadingMessage('Warming up the server... This may take a moment.');
      }
    }, 1200); 
  
    if (!selectedDestination) {
      alert('Please select a destination');
      return;
    }
  
    const tripData: CreateTripRequest = {
      ...formData,
      name: formData.name,
      location: selectedDestination,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isPublic: formData.isPublic,
      activities,
    };
  
    try {
      await createTripMutation.mutate(tripData);
      alert('Trip created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        isPublic: false,
      });
      setActivities([]);
      setSelectedDestination('');
      refetch();
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      clearTimeout(warmupTimer);
      setLoadingMessage(''); // remove message
      setIsSubmitting(false);
      submitInProgressRef.current = false;
    }
  };
  
  const addActivity = () => {
    if (newActivity.name && newActivity.description) {
      setActivities([...activities, newActivity]);
      setNewActivity({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        cost: 0,
        location: '',
        type: 'attraction',
        isPublic: false,
      });
    }
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [userTrips]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Trip Planning</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Trip
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Trip Map</h2>
          <div className="card p-6">
            <TripMap 
              center={{ lat: 37.7749, lng: -122.4194 }}
              zoom={4}
              markers={[
                { lat: 35.6762, lng: 139.6503, title: "Tokyo, Japan" },
                { lat: 36.3932, lng: 25.4615, title: "Santorini, Greece" },
                { lat: -8.3405, lng: 115.0920, title: "Bali, Indonesia" }
              ]}
            />
          </div>
        </div>

  {/* Trips List */}
<div className="mb-8">
  <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Trips</h2>

  {/* Show loading spinner while fetching */}
  {tripsLoading && (
    <div className="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
  )}

  {/* Show error message if there is one */}
  {tripsError && (
    <ErrorMessage error={tripsError} onRetry={refetch} />
  )}

  {/* Show "no trips" message if fetch completed but array is empty */}
  {!tripsLoading &&
    !tripsError &&
    Array.isArray(userTrips) &&
    userTrips.length === 0 && (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
        <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
      <button
        onClick={() => setShowCreateForm(true)}
        className="btn-primary"
      >
        Create Your First Trip
      </button>
    </div>
  )}

  {/* Render trips + pagination together */}
{!tripsLoading && !tripsError && paginatedTrips.length > 0 && (
  <>
    {/* Trips Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedTrips.map((trip: any) => (
        <div key={trip.id} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{trip.name}</h3>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400 hover:text-primary-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{trip.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              {trip.destination?.name}, {trip.destination?.country}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(trip.startDate).toLocaleDateString()} –{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              {trip.activities?.length ?? 0} activities
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="h-4 w-4 mr-2" />
              ${trip.totalCost?.toLocaleString() ?? 0}
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 btn-primary text-sm">View Details</button>
            <button className="flex-1 btn-secondary text-sm">Edit</button>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination Controls */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-primary-600 text-white"
                : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </>
)}
</div> 

        {/* Create Trip Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Trip</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateTrip} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trip Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Summer Adventure in Tokyo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination
                      </label>
                      <select
                        required
                        value={selectedDestination}
                        onChange={(e) => setSelectedDestination(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select a destination</option>
                        {destinationsData?.data.map((destination) => (
                          <option key={destination.id} value={destination.id}>
                            {destination.name}, {destination.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your trip..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activities
                    </label>
                    
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{activity.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeActivity(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <div className="flex justify-between text-sm text-gray-500 mt-2">
                            <span>{activity.startTime} - {activity.endTime}</span>
                            <span>${activity.cost}</span>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Activity name"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={newActivity.location}
                            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            placeholder="Description"
                            rows={2}
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <div className="flex space-x-2">
                            <input
                              type="time"
                              value={newActivity.startTime}
                              onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                              type="time"
                              value={newActivity.endTime}
                              onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                              type="number"
                              placeholder="Cost"
                              value={newActivity.cost}
                              onChange={(e) => setNewActivity({ ...newActivity, cost: Number(e.target.value) })}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <select
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as any })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="attraction">Attraction</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="transport">Transport</option>
                            <option value="accommodation">Accommodation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={addActivity}
                          className="mt-3 w-full btn-secondary flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Activity
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      Make this trip public
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createTripMutation.loading || isSubmitting}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createTripMutation.loading || isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          {loadingMessage || 'Creating Your Trip!'}
                        </div>
                      ) : (
                        'Create Trip'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanPage;