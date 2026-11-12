import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { ProductCard } from '@/components/ProductCard';
import { categories, formatPrice, getProductById, products, type Product, type ProductCategory } from '@/data/catalog';

type Page = 'home' | 'produtos' | 'produto' | 'consultoria' | 'loja' | 'contato';

type ContactConfig = {
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  location: string;
  hours: string;
};

const contactConfig: ContactConfig = {
  whatsappNumber: '556798940035',
  instagramHandle: '@ng_store_ms',
  instagramUrl: 'https://www.instagram.com/ng_store_ms?cplk=MW41OHJvemtreWl2aA==',
  location: 'Jardim, Mato Grosso do Sul',
  hours: 'Horários a confirmar',
};

function isProductCategory(value: string | null): value is ProductCategory {
  return value !== null && categories.some((category) => category.id === value);
}

function getRoute(): { page: Page; productId?: string; category?: ProductCategory } {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('produto/')) return { page: 'produto', productId: hash.replace('produto/', '') };
  if (hash.startsWith('produtos')) {
    const params = new URLSearchParams(hash.split('?')[1] ?? '');
    const category = params.get('categoria');
    return { page: 'produtos', category: isProductCategory(category) ? category : undefined };
  }
  if (hash === 'consultoria') return { page: 'consultoria' };
  if (hash === 'loja') return { page: 'loja' };
  if (hash === 'contato') return { page: 'contato' };
  return { page: 'home' };
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (hash: string): void => {
    window.location.hash = hash;
  };

  const handleWhatsApp = (product?: Product): void => {
    const message = product
      ? `Olá! Gostaria de consultar o produto ${product.name}: ${window.location.href}`
      : 'Olá! Gostaria de falar com uma consultora da NG Store.';
    window.open(`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="site-shell">
      <Header page={route.page} mobileMenuOpen={mobileMenuOpen} onToggleMenu={() => setMobileMenuOpen((open) => !open)} onNavigate={navigate} />
      {route.page === 'home' && <Home onNavigate={navigate} onWhatsApp={handleWhatsApp} />}
      {route.page === 'produtos' && <ProductsPage initialCategory={route.category} onOpenProduct={(id) => navigate(`produto/${id}`)} onWhatsApp={handleWhatsApp} />}
      {route.page === 'produto' && route.productId && <ProductPage productId={route.productId} onBack={() => navigate('produtos')} onOpenProduct={(id) => navigate(`produto/${id}`)} onWhatsApp={handleWhatsApp} />}
      {route.page === 'consultoria' && <ConsultoriaPage onWhatsApp={() => handleWhatsApp()} />}
      {route.page === 'loja' && <StorePage onNavigate={navigate} />}
      {route.page === 'contato' && <ContactPage onWhatsApp={() => handleWhatsApp()} />}
      <Footer onNavigate={navigate} />
    </div>
  );
}

type HeaderProps = {
  page: Page;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (hash: string) => void;
};

function Header({ page, mobileMenuOpen, onToggleMenu, onNavigate }: HeaderProps) {
  const navItems: { label: string; hash: string; page: Page }[] = [
    { label: 'Início', hash: '', page: 'home' },
    { label: 'Produtos', hash: 'produtos', page: 'produtos' },
    { label: 'Consultoria', hash: 'consultoria', page: 'consultoria' },
    { label: 'Nossa loja', hash: 'loja', page: 'loja' },
    { label: 'Contato', hash: 'contato', page: 'contato' },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onToggleMenu();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen, onToggleMenu]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__item"><Sparkles size={11} /> Moda Country & Casual | Consultoria Residencial e On-line</span>
          <a className="topbar__item" href={contactConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={11} /> Siga-nos no Instagram</a>
        </div>
      </div>
      <header className="header">
        <div className="container header__inner">
          <button className="brand-button" onClick={() => onNavigate('')} aria-label="Ir para o início"><BrandMark compact /></button>
          <nav id="main-navigation" className={`header__nav${mobileMenuOpen ? ' is-open' : ''}`} aria-label="Navegação principal">
            {navItems.map((item) => (
              <a key={item.label} className={page === item.page ? 'is-active' : ''} href={`#${item.hash}`}>{item.label}</a>
            ))}
          </nav>
          <div className="header__tools">
            <form className="search-box" onSubmit={(event) => { event.preventDefault(); onNavigate('produtos'); }}>
              <Search size={14} /><input placeholder="Buscar produtos..." aria-label="Buscar produtos" />
            </form>
            <button className="header-search-toggle" onClick={() => onNavigate('produtos')} aria-label="Buscar produtos"><Search size={20} /></button>
            <button className="mobile-toggle" onClick={onToggleMenu} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>{mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}</button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && <button className="mobile-menu-backdrop" onClick={onToggleMenu} aria-label="Fechar menu" />}
    </>
  );
}

type HomeProps = { onNavigate: (hash: string) => void; onWhatsApp: (product?: Product) => void };

function Home({ onNavigate, onWhatsApp }: HomeProps) {
  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">NG Store / Country & Casual</span>
            <h1>Invista no seu visual e na sua imagem.</h1>
            <p>Country & Casual com estilo, qualidade e personalidade.</p>
            <div className="hero__actions">
              <a className="primary-button" href="#produtos">Conheça nossa coleção <ArrowRight size={15} /></a>
              <button className="outline-button" onClick={() => onWhatsApp()}><MessageCircle size={15} /> Fale com uma consultora</button>
            </div>
            <div className="hero__meta"><span>01</span><span>/</span><span>03</span><span className="hero__progress" /><span>Editorial 2026</span></div>
          </div>
        </div>
      </section>
      <div className="marquee"><span>Identidade</span><span>Presença</span><span>Autenticidade</span><span>Country & Casual</span><span>Identidade</span><span>Presença</span></div>
      <section className="intro">
        <div className="container intro__grid">
          <div className="intro__title">Uma nova leitura do vestir<strong>Estilo é a forma como a sua presença chega antes de você.</strong></div>
          <div className="intro__copy"><p>A NG Store nasceu para quem entende que roupa é expressão. Nosso olhar combina a força da estética country com a leveza do casual, criando escolhas que acompanham a sua personalidade e valorizam a sua imagem.</p><p>Este catálogo apresenta uma seleção demonstrativa para materializar a experiência digital da marca. As peças, preços e imagens devem ser substituídos pelo catálogo oficial na próxima etapa.</p><a className="text-link" href="#contato">Conheça a NG Store <ArrowRight size={15} /></a></div>
        </div>
      </section>
      <section className="category-section">
        <div className="container">
          <div className="section-topline"><div className="section-heading"><span className="eyebrow">Curadoria NG</span><h2>Nossas categorias</h2><p>Encontre o estilo ideal para cada ocasião, com peças pensadas para criar presença.</p></div><a href="#produtos" className="text-link">Ver todas as categorias <ArrowRight size={15} /></a></div>
          <div className="category-strip">{categories.map((category) => <a href={`#produtos?categoria=${category.id}`} className="category-card" key={category.id}><img src={category.image} alt={category.label} loading="lazy" /><div className="category-card__content"><h3>{category.label}</h3><p>{category.description}</p></div></a>)}</div>
        </div>
      </section>
      <section className="products-section">
        <div className="container">
          <div className="section-topline"><div className="section-heading"><span className="eyebrow">Seleção demonstrativa</span><h2>Produtos em destaque</h2><p>Uma vitrine de referência para apresentar a experiência de descoberta e atendimento.</p></div><a href="#produtos" className="text-link">Ver todos os produtos <ArrowRight size={15} /></a></div>
          <div className="product-grid">{products.filter((product) => product.featured).slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onOpen={(id) => onNavigate(`produto/${id}`)} onWhatsApp={onWhatsApp} />)}</div>
        </div>
      </section>
      <section className="editorial"><div className="container editorial__grid"><div className="editorial__image" /><div className="editorial__copy"><span className="eyebrow">Coleção em destaque</span><h2>O essencial nunca é básico.</h2><p>Texturas, proporções e detalhes que deixam o visual mais forte sem perder a naturalidade.</p><a className="outline-button" href="#produtos">Explorar seleção <ArrowRight size={15} /></a></div></div></section>
      <ServiceSection onWhatsApp={onWhatsApp} onNavigate={onNavigate} />
      <InstagramBand />
    </main>
  );
}

function ServiceSection({ onWhatsApp, onNavigate }: { onWhatsApp: () => void; onNavigate: (hash: string) => void }) {
  return <section className="service-section"><div className="container"><div className="section-heading"><span className="eyebrow">Viva a experiência</span><h2>Mais do que vestir. É sobre se reconhecer.</h2></div><div className="service-grid"><article className="service-card"><img src="https://images.pexels.com/photos/31966332/pexels-photo-31966332.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Mulher usando chapéu em ambiente country" loading="lazy" /><div className="service-card__content"><h3>Consultoria de imagem</h3><p>Descubra o poder de uma imagem bem construída, no seu ritmo e com atendimento próximo.</p><button className="outline-button" onClick={onWhatsApp}>Solicitar atendimento <ArrowRight size={15} /></button></div></article><article className="service-card"><img src="https://images.pexels.com/photos/8306368/pexels-photo-8306368.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Interior de boutique de moda" loading="lazy" /><div className="service-card__content"><h3>Nossa loja</h3><p>Em Jardim, Mato Grosso do Sul. Um espaço para descobrir seu próximo visual.</p><button className="outline-button" onClick={() => onNavigate('loja')}>Conheça a loja <ArrowRight size={15} /></button></div></article></div></div></section>;
}

function InstagramBand() { return <section className="instagram-band"><div className="container instagram-band__inner"><div className="instagram-band__title"><Instagram size={40} strokeWidth={1.3} /><div><h3>Siga nosso Instagram</h3><p>Acompanhe novidades, lançamentos e muito mais.</p></div></div><a className="outline-button" href={contactConfig.instagramUrl} target="_blank" rel="noreferrer">Acessar perfil <ArrowRight size={15} /></a></div></section>; }

function ProductsPage({ initialCategory, onOpenProduct, onWhatsApp }: { initialCategory?: ProductCategory; onOpenProduct: (id: string) => void; onWhatsApp: (product: Product) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ProductCategory>(initialCategory ?? 'all');
  const [sort, setSort] = useState('featured');
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery = `${product.name} ${product.categoryLabel}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    if (sort === 'lowest') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'highest') return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, query, sort]);

  return <main className="page"><div className="container"><div className="page__intro"><div><span className="eyebrow">Catálogo demonstrativo</span><h1>Escolhas com identidade.</h1></div><p>Pesquise por nome, explore categorias e abra cada peça para conhecer a experiência de atendimento personalizada.</p></div><div className="filters"><div className="filter-list"><button className={`filter-button${category === 'all' ? ' is-active' : ''}`} onClick={() => setCategory('all')}>Todos</button>{categories.map((item) => <button className={`filter-button${category === item.id ? ' is-active' : ''}`} key={item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div><div className="filter-list"><label className="search-box"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." aria-label="Buscar no catálogo" /></label><select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos"><option value="featured">Destaques</option><option value="lowest">Menor preço</option><option value="highest">Maior preço</option></select></div></div>{filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpenProduct} onWhatsApp={onWhatsApp} />)}</div> : <div className="empty-state">Nenhuma peça encontrada para essa busca.</div>}</div></main>;
}

function ProductPage({ productId, onBack, onOpenProduct, onWhatsApp }: { productId: string; onBack: () => void; onOpenProduct: (id: string) => void; onWhatsApp: (product: Product) => void }) {
  const product = getProductById(productId);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  if (!product) return <main className="page"><div className="container empty-state">Produto não encontrado. <button className="text-link" onClick={onBack}>Voltar ao catálogo</button></div></main>;
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  return <main className="product-detail"><div className="container"><button className="back-link" onClick={onBack}><ArrowLeft size={14} /> Voltar ao catálogo</button><div className="detail-grid"><div className="detail-gallery"><div className="detail-gallery__thumbs">{product.gallery.map((image, index) => <button key={image} className={`detail-gallery__thumb${activeImage === index ? ' is-active' : ''}`} onClick={() => setActiveImage(index)} aria-label={`Imagem ${index + 1}`}><img src={image} alt="" /></button>)}</div><button className="detail-gallery__main" onClick={() => setGalleryOpen(true)} aria-label="Ampliar imagem do produto"><img src={product.gallery[activeImage]} alt={product.name} /><span className="detail-gallery__zoom"><Search size={17} /></span></button></div><div className="detail-copy"><span className="eyebrow">{product.categoryLabel}</span><h1>{product.name}</h1><div className="detail-copy__price">{formatPrice(product.price)}</div><p className="detail-copy__description">{product.description}</p><ul className="detail-list">{product.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><button className="primary-button" onClick={() => onWhatsApp(product)}><MessageCircle size={15} /> Consultar pelo WhatsApp</button><p className="demo-note">Os valores e informações desta vitrine são demonstrativos e não representam disponibilidade comercial real.</p></div></div>{related.length > 0 && <section className="related"><h2>Você também pode gostar</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} onOpen={onOpenProduct} onWhatsApp={onWhatsApp} />)}</div></section>}</div>{galleryOpen && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ampliada de ${product.name}`} onClick={() => setGalleryOpen(false)}><button className="gallery-lightbox__close" onClick={() => setGalleryOpen(false)} aria-label="Fechar imagem ampliada"><X size={24} /></button><img src={product.gallery[activeImage]} alt={product.name} onClick={(event) => event.stopPropagation()} /></div>}<button className="mobile-product-cta" onClick={() => onWhatsApp(product)}><MessageCircle size={17} /> Consultar pelo WhatsApp</button></main>;
}

function ConsultoriaPage({ onWhatsApp }: { onWhatsApp: () => void }) { return <main className="page"><div className="container"><div className="contact-grid"><div><span className="eyebrow">Atendimento próximo</span><h1 className="serif" style={{ fontSize: 'clamp(58px, 8vw, 104px)', lineHeight: '.84', margin: '16px 0' }}>Sua imagem, mais intencional.</h1><p style={{ color: 'var(--muted)', lineHeight: 1.8, maxWidth: 430 }}>A consultoria residencial e on-line da NG Store nasce para tornar suas escolhas mais simples, coerentes e alinhadas com quem você é.</p><button className="primary-button" onClick={onWhatsApp}>Solicitar atendimento <ArrowRight size={15} /></button></div><div className="editorial__image" style={{ minHeight: 520, backgroundImage: "url('https://images.pexels.com/photos/31966332/pexels-photo-31966332.jpeg?auto=compress&cs=tinysrgb&w=1400')" }} /></div><div className="intro" style={{ paddingBottom: 0 }}><div className="intro__grid"><div className="intro__title">Como podemos ajudar<strong>Escolhas mais seguras para a sua rotina.</strong></div><div className="intro__copy"><p>Converse com a nossa equipe para entender o formato de atendimento mais adequado às suas necessidades. A proposta é olhar para o seu momento, seu estilo e os contextos em que você quer se sentir ainda mais confiante.</p><p>Os detalhes da consultoria, disponibilidade e valores são apresentados no contato inicial.</p></div></div></div></div></main>; }

function StorePage({ onNavigate }: { onNavigate: (hash: string) => void }) { return <main className="page"><div className="container"><div className="page__intro"><div><span className="eyebrow">Presença física</span><h1>Venha viver a NG Store.</h1></div><p>Um espaço para descobrir peças, conversar sobre estilo e receber um atendimento mais próximo.</p></div><div className="editorial__grid"><div className="editorial__image" style={{ backgroundImage: "url('https://images.pexels.com/photos/8306368/pexels-photo-8306368.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} /><div className="editorial__copy"><span className="eyebrow">Jardim / MS</span><h2>Country com acolhimento.</h2><p>A loja física está localizada em Jardim, Mato Grosso do Sul. Endereço completo e horários serão publicados assim que confirmados pela marca.</p><button className="outline-button" onClick={() => onNavigate('contato')}>Falar com a loja <ArrowRight size={15} /></button></div></div></div></main>; }

function ContactPage({ onWhatsApp }: { onWhatsApp: () => void }) { const [sent, setSent] = useState(false); const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); }; return <main className="page"><div className="container"><div className="page__intro"><div><span className="eyebrow">Vamos conversar</span><h1>Seu próximo visual começa aqui.</h1></div><p>Escolha a forma de contato mais confortável para você. Nossa equipe está pronta para receber sua mensagem.</p></div><div className="contact-grid"><div><div className="contact-list"><div className="contact-item"><MessageCircle size={19} /><div><strong>WhatsApp</strong><span>{contactConfig.whatsappNumber ? 'Atendimento disponível' : 'Número oficial a confirmar'}</span></div></div><div className="contact-item"><Instagram size={19} /><div><strong>Instagram</strong><a href={contactConfig.instagramUrl} target="_blank" rel="noreferrer">{contactConfig.instagramHandle}</a></div></div><div className="contact-item"><MapPin size={19} /><div><strong>Localização</strong><span>{contactConfig.location}</span></div></div><div className="contact-item"><Store size={19} /><div><strong>Horários</strong><span>{contactConfig.hours}</span></div></div></div><button className="primary-button" style={{ marginTop: 27 }} onClick={onWhatsApp}><MessageCircle size={15} /> Chamar no WhatsApp</button></div><form className="contact-form" onSubmit={handleSubmit}><h2>Envie uma mensagem.</h2><div className="form-grid"><div className="field"><label htmlFor="name">Seu nome</label><input id="name" name="name" autoComplete="name" inputMode="text" required placeholder="Como podemos chamar você?" /></div><div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="seu@email.com" /></div><div className="field field--full"><label htmlFor="message">Mensagem</label><textarea id="message" name="message" required placeholder="Conte um pouco sobre o que você procura..." /></div></div><button className="primary-button" type="submit">Enviar mensagem <ArrowRight size={15} /></button>{sent && <p className="success-message" role="status">Mensagem registrada nesta demonstração. O canal de envio oficial será conectado na próxima etapa.</p>}</form></div></div></main>; }

function Footer({ onNavigate }: { onNavigate: (hash: string) => void }) { return <footer className="footer"><div className="container"><div className="footer__grid"><div className="footer__column"><button className="brand-button" onClick={() => onNavigate('')}><BrandMark /></button><p style={{ marginTop: 20, maxWidth: 190 }}>Moda Country & Casual com estilo, qualidade e personalidade.</p></div><div className="footer__column"><h4>Navegação</h4><a href="#">Início</a><a href="#produtos">Produtos</a><a href="#consultoria">Consultoria</a><a href="#loja">Nossa loja</a></div><div className="footer__column"><h4>Atendimento</h4><a href="#contato">Contato</a><a href={contactConfig.instagramUrl} target="_blank" rel="noreferrer">Instagram</a><a href={`https://wa.me/${contactConfig.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a><p>Jardim — MS</p></div><div className="footer__column"><h4>Manifesto</h4><p className="footer__tagline">“Invista no seu visual e na sua imagem.”</p></div></div><div className="footer__bottom"><span>© 2026 NG Store. Todos os direitos reservados.</span><span>Experiência digital demonstrativa</span></div></div></footer>; }

export default App;
