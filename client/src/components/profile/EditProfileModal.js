// client/src/components/profile/EditProfileModal.js
import React, { useState } from 'react';
import { X, User, Camera, DollarSign, Loader, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import usersService from '../../services/usersService';
import authService from '../../services/authService';

const EditProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    coverImage: user?.coverImage || '',
    subscriptionPrice: user?.subscriptionPrice || 0,
    isCreator: user?.isCreator || false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    // Validar datos
    const validation = usersService.validateProfileData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors([]);

      // Preparar datos para enviar solo los campos que cambiaron
      const updatedFields = {};
      
      if (formData.displayName !== user?.displayName) {
        updatedFields.displayName = formData.displayName;
      }
      
      if (formData.bio !== user?.bio) {
        updatedFields.bio = formData.bio;
      }
      
      if (formData.profileImage !== user?.profileImage) {
        updatedFields.profileImage = formData.profileImage;
      }
      
      if (formData.coverImage !== user?.coverImage) {
        updatedFields.coverImage = formData.coverImage;
      }
      
      if (formData.subscriptionPrice !== user?.subscriptionPrice) {
        updatedFields.subscriptionPrice = parseFloat(formData.subscriptionPrice);
      }
      
      if (formData.isCreator !== user?.isCreator) {
        updatedFields.isCreator = formData.isCreator;
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.info('No hay cambios para guardar');
        onClose();
        return;
      }

      const response = await usersService.updateProfile(updatedFields);
      
      // Actualizar datos del usuario en authService si es necesario
      const currentToken = authService.getToken();
      if (currentToken) {
        authService.setAuthData(currentToken, response.user);
      }
      
      onProfileUpdated(response.user);
      
    } catch (error) {
      toast.error(error.message);
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (field) => {
    // Placeholder para futura implementación de subida de archivos
    toast.info('Función de subida de imágenes próximamente');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 rounded-xl border border-purple-500/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <ul className="text-red-400 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen de Perfil
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={() => handleImageUpload('profileImage')}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                >
                  <Camera size={14} />
                  Subir imagen
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen de Portada
            </label>
            <div className="space-y-2">
              <div className="w-full h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden">
                {formData.coverImage && (
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://ejemplo.com/portada.jpg"
                className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              <button
                type="button"
                onClick={() => handleImageUpload('coverImage')}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                <Camera size={14} />
                Subir imagen de portada
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre para mostrar
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={4}
              maxLength={500}
              className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.bio.length}/500
            </div>
          </div>

          {/* Creator Settings */}
          <div className="border-t border-purple-500/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Cuenta de Creator
                </label>
                <p className="text-xs text-gray-400">
                  Permite recibir suscripciones y tips
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isCreator"
                  checked={formData.isCreator}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Subscription Price */}
            {formData.isCreator && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio de Suscripción (USD/mes)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    name="subscriptionPrice"
                    value={formData.subscriptionPrice}
                    onChange={handleChange}
                    min="0"
                    max="99.99"
                    step="0.01"
                    placeholder="9.99"
                    className="w-full bg-black/50 border border-purple-500/30 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;