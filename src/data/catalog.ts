export type ProductCategory = 'feminino' | 'masculino' | 'camisas' | 'calcas' | 'botas' | 'chapeus' | 'acessorios';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  details: string[];
};

export type Category = {
  id: ProductCategory;
  label: string;
  description: string;
  image: string;
};

const images = {
  hero: 'https://images.pexels.com/photos/9270943/pexels-photo-9270943.jpeg?auto=compress&cs=tinysrgb&w=1800',
  couple: 'https://images.pexels.com/photos/15272016/pexels-photo-15272016.jpeg?auto=compress&cs=tinysrgb&w=1400',
  woman: 'https://images.pexels.com/photos/32742412/pexels-photo-32742412.jpeg?auto=compress&cs=tinysrgb&w=1000',
  man: 'https://images.pexels.com/photos/35060419/pexels-photo-35060419.jpeg?auto=compress&cs=tinysrgb&w=1000',
  boots: 'https://images.pexels.com/photos/6752430/pexels-photo-6752430.jpeg?auto=compress&cs=tinysrgb&w=1000',
  store: 'https://images.pexels.com/photos/8306368/pexels-photo-8306368.jpeg?auto=compress&cs=tinysrgb&w=1600',
  barn: 'https://images.pexels.com/photos/31966332/pexels-photo-31966332.jpeg?auto=compress&cs=tinysrgb&w=1000',
  denim: 'https://images.pexels.com/photos/17353626/pexels-photo-17353626.jpeg?auto=compress&cs=tinysrgb&w=1000',
};

export const categories: Category[] = [
  { id: 'feminino', label: 'Moda feminina', description: 'Peças que traduzem presença e personalidade.', image: images.woman },
  { id: 'masculino', label: 'Moda masculina', description: 'Essenciais de atitude para todos os dias.', image: images.man },
  { id: 'camisas', label: 'Camisas', description: 'Texturas, cortes e identidade country.', image: images.hero },
  { id: 'calcas', label: 'Calças', description: 'Denim e modelagens para acompanhar você.', image: images.denim },
  { id: 'botas', label: 'Botas', description: 'O acabamento marcante do seu visual.', image: images.boots },
  { id: 'chapeus', label: 'Chapéus', description: 'O detalhe que completa a imagem.', image: images.barn },
];

export const products: Product[] = [
  {
    id: 'camisa-western-01',
    name: 'Camisa Western Essential',
    category: 'camisas',
    categoryLabel: 'Camisas',
    price: 179.9,
    description: 'Peça demonstrativa de referência para o catálogo NG Store, com presença marcante e leitura contemporânea do estilo western.',
    image: images.man,
    gallery: [images.man, images.hero, images.couple],
    featured: true,
    details: ['Catálogo demonstrativo', 'Consulte disponibilidade e variações', 'Atendimento personalizado'],
  },
  {
    id: 'blusa-country-01',
    name: 'Blusa Country Feminina',
    category: 'feminino',
    categoryLabel: 'Moda feminina',
    price: 149.9,
    description: 'Uma base versátil para composições com personalidade, pensada para a mulher que valoriza imagem e autenticidade.',
    image: images.woman,
    gallery: [images.woman, images.couple, images.barn],
    featured: true,
    details: ['Catálogo demonstrativo', 'Consulte tamanhos disponíveis', 'Imagem meramente ilustrativa'],
  },
  {
    id: 'denim-tradicional-01',
    name: 'Denim Tradicional',
    category: 'calcas',
    categoryLabel: 'Calças',
    price: 199.9,
    description: 'Denim de presença, pensado para acompanhar do cotidiano às ocasiões que pedem mais atitude.',
    image: images.denim,
    gallery: [images.denim, images.man, images.hero],
    featured: true,
    details: ['Catálogo demonstrativo', 'Consulte modelagens e tamanhos', 'Imagem meramente ilustrativa'],
  },
  {
    id: 'bota-country-01',
    name: 'Bota Country Premium',
    category: 'botas',
    categoryLabel: 'Botas',
    price: 499.9,
    description: 'Um ícone do universo country para finalizar a composição com força e elegância.',
    image: images.boots,
    gallery: [images.boots, images.barn, images.store],
    featured: true,
    details: ['Catálogo demonstrativo', 'Consulte numerações disponíveis', 'Imagem meramente ilustrativa'],
  },
  {
    id: 'chapeu-western-01',
    name: 'Chapéu Western',
    category: 'chapeus',
    categoryLabel: 'Chapéus',
    price: 229.9,
    description: 'A assinatura final de um visual com identidade, tradição e leitura atual.',
    image: images.barn,
    gallery: [images.barn, images.couple, images.man],
    featured: true,
    details: ['Catálogo demonstrativo', 'Consulte cores e tamanhos', 'Imagem meramente ilustrativa'],
  },
  {
    id: 'cinto-country-01',
    name: 'Cinto Country Metal',
    category: 'acessorios',
    categoryLabel: 'Acessórios',
    price: 249.9,
    description: 'Detalhe expressivo para transformar o essencial em uma composição memorável.',
    image: images.couple,
    gallery: [images.couple, images.boots, images.store],
    details: ['Catálogo demonstrativo', 'Consulte acabamentos disponíveis', 'Imagem meramente ilustrativa'],
  },
];

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

export const getProductById = (id: string): Product | undefined => products.find((product) => product.id === id);
