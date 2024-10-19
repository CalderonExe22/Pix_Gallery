import { useState, useEffect } from "react";
import axiosApi from "../../services/axiosApi";

export default function Create() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosApi.get('photos/category/');
        setCategories(response.data);
      } catch (error) {
        console.log('Error al obtener las categorías:', error);
      }
    };
    getCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    precio: 0,
    category: '',
    is_free: true,
    is_public: true, // Añadir is_public aquí
    image: null // La imagen se maneja como archivo, no como string
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0] // Almacenamos el archivo de imagen
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('image', formData.image); // Importante: añadir la imagen al FormData
    data.append('precio', formData.precio); // Añadir el campo precio
    data.append('is_free', formData.is_free); // Añadir el campo is_free
    data.append('is_public', formData.is_public); // Añadir el campo is_public
    
    try {
      const response = await axiosApi.post('photos/photography/', data);
      console.log('La fotografía se subió correctamente', response);
    } catch (error) {
      console.log('Error al subir la fotografía', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form className="flex flex-col gap-11 p-20 bg-indigo-300 rounded-xl" onSubmit={handleSubmit}>
        <h1 className="text-center font-medium text-3xl">Subir fotografia</h1>
        <input 
          type="text" 
          id="title" 
          name="title"
          onChange={handleChange} 
          value={formData.title}
          placeholder="Título"
          required
        />
        <input 
          type="text" 
          id="description" 
          name="description" 
          onChange={handleChange} 
          value={formData.description}
          placeholder="Descripción"
        />
        <input 
          type="number" 
          id="precio" 
          name="precio"
          onChange={handleChange}
          value={formData.precio}
          placeholder="Precio"
          required
        />
        <select 
          id="category" 
          name="category"
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <label>
          <input 
            type="checkbox" 
            id="is_free" 
            name="is_free"
            checked={formData.is_free}
            onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
          />
          Gratis
        </label>
        <label>
          <input 
            type="checkbox" 
            id="is_public" 
            name="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
          />
          Pública
        </label>
        <input 
          type="file" 
          id="image" 
          name="image" 
          onChange={handleImageChange} 
          accept="image/*"
          required
        />
        <button type="submit">
          Subir fotografía
        </button>
    </form>
  );
}