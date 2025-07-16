// client/src/components/CreatePostModal.js
import React, { useState } from 'react';
import { X, Image, Video, DollarSign, Lock } from 'lucide-react';
import contentService from '../services/contentService';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'text',
    mediaUrl: '',
    isPremium: false,
    price: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos
    const validation = contentService.validatePostData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await contentService.createPost(formData);
      
      // Notificar al componente padre que se creó un post
      if (onPostCreated) {
        onPostCreated(response.post);
      }
      
      // Limpiar formulario y cerrar modal
      resetForm();
      onClose();
      
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      contentType: 'text',
      mediaUrl: '',
      isPremium: false,
      price: 0
    });
    setErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white">Crear Nuevo Post</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <ul className="text-red-400 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Título (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="¿Qué título le pondrías?"
              className="w-full bg-black/40 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              maxLength={255}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="¿Qué está pasando?"
              rows={4}
              className="w-full bg-black/40 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              maxLength={2000}
              required
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.description.length}/2000
            </div>
          </div>

          {/* Tipo de contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de contenido
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, contentType: 'text' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
                  formData.contentType === 'text' 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-black/40 border-gray-600 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                <span className="text-sm">Texto</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, contentType: 'image' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
                  formData.contentType === 'image' 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-black/40 border-gray-600 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                <Image size={16} />
                <span className="text-sm">Imagen</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, contentType: 'video' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
                  formData.contentType === 'video' 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-black/40 border-gray-600 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                <Video size={16} />
                <span className="text-sm">Video</span>
              </button>
            </div>
          </div>

          {/* URL de media (si no es texto) */}
          {formData.contentType !== 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL del {formData.contentType === 'image' ? 'imagen' : 'video'}
              </label>
              <input
                type="url"
                name="mediaUrl"
                value={formData.mediaUrl}
                onChange={handleChange}
                placeholder={`Pega aquí la URL de tu ${formData.contentType === 'image' ? 'imagen' : 'video'}`}
                className="w-full bg-black/40 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}

          {/* Configuración Premium */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 bg-transparent border-2 border-purple-500 rounded focus:ring-purple-500"
              />
              <label htmlFor="isPremium" className="flex items-center gap-2 text-sm text-gray-300">
                <Lock size={16} />
                Contenido Premium
              </label>
            </div>

            {formData.isPremium && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    max="999.99"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-black/40 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-lg font-semibold transition-all"
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !formData.description.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
            >
              {isLoading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;