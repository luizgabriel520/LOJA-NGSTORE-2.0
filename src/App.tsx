import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { BrandMark } from '@/components/BrandMark';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CartProvider, useCart } from '@/context/CartContext';
import {
  categories,
  formatPrice,
  getProductById,
  products,
  type Product,
  type ProductCategory,
} from '@/data/catalog';
import {
  fadeUp,
  fadeIn,
  imageReveal,
  staggerContainer,
  staggerFast,
  textLine,
  scaleIn,
  headerEnter,
  floatingBtn,
  galleryImage,
  ease,
} from '@/motion/variants';
import { MotionSection, MotionDiv, MotionItem } from '@/motion/MotionSection';

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
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}

function AppShell() {
  const [route, setRoute] = useState(getRoute);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      setMobileMenuOpen(false);
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
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
    window.open(
      `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="site-shell">
      <Header
        page={route.page}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
        onNavigate={navigate}
      />
      {route.page === 'home' && <Home onNavigate={navigate} onWhatsApp={handleWhatsApp} />}
      {route.page === 'produtos' && (
        <ProductsPage
          initialCategory={route.category}
          onOpenProduct={(id) => navigate(`produto/${id}`)}
          onWhatsApp={handleWhatsApp}
        />
      )}
      {route.page === 'produto' && route.productId && (
        <ProductPage
          productId={route.productId}
          onBack={() => navigate('produtos')}
          onOpenProduct={(id) => navigate(`produto/${id}`)}
          onWhatsApp={handleWhatsApp}
        />
      )}
      {route.page === 'consultoria' && <ConsultoriaPage onWhatsApp={() => handleWhatsApp()} />}
      {route.page === 'loja' && <StorePage onNavigate={navigate} />}
      {route.page === 'contato' && <ContactPage onWhatsApp={() => handleWhatsApp()} />}
      <Footer onNavigate={navigate} />

      <CartDrawer whatsappNumber={contactConfig.whatsappNumber} />

      {/* Floating WhatsApp — premium micro-interaction */}
      <motion.button
        className="floating-whatsapp"
        onClick={() => handleWhatsApp()}
        aria-label="Falar no WhatsApp"
        variants={reduce ? undefined : floatingBtn}
        initial={reduce ? false : 'hidden'}
        animate="visible"
        whileHover={reduce ? undefined : { scale: 1.06, y: -3 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.3, ease: ease.out }}
      >
        <MessageCircle size={22} strokeWidth={1.6} />
        <span className="floating-whatsapp__label">WhatsApp</span>
      </motion.button>
    </div>
  );
}

/* ───────────────────────── HEADER ───────────────────────── */

type HeaderProps = {
  page: Page;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (hash: string) => void;
};

function Header({ page, mobileMenuOpen, onToggleMenu, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const { itemCount, openCart } = useCart();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

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
      <motion.div
        className="topbar"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <div className="container topbar__inner">
          <span className="topbar__item">
            <Sparkles size={11} /> Moda Country & Casual | Consultoria Residencial e On-line
          </span>
          <a
            className="topbar__item"
            href={contactConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={11} /> Siga-nos no Instagram
          </a>
        </div>
      </motion.div>

      <motion.header
        className={`header${scrolled ? ' is-scrolled' : ''}${mobileMenuOpen ? ' is-menu-open' : ''}`}
        variants={reduce ? undefined : headerEnter}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        <div className="container header__inner">
          <button
            className="brand-button"
            onClick={() => onNavigate('')}
            aria-label="Ir para o início"
          >
            <BrandMark compact />
          </button>

          <nav
            id="main-navigation"
            className={`header__nav${mobileMenuOpen ? ' is-open' : ''}`}
            aria-label="Navegação principal"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                className={page === item.page ? 'is-active' : ''}
                href={`#${item.hash}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header__tools">
            <form
              className="search-box"
              onSubmit={(event) => {
                event.preventDefault();
                onNavigate('produtos');
              }}
            >
              <Search size={14} />
              <input placeholder="Buscar produtos..." aria-label="Buscar produtos" />
            </form>
            <button
              type="button"
              className="header-cart"
              onClick={openCart}
              aria-label={itemCount > 0 ? `Carrinho com ${itemCount} itens` : 'Abrir carrinho'}
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {itemCount > 0 && <span className="header-cart__badge">{itemCount > 99 ? '99+' : itemCount}</span>}
            </button>
            <button
              className="header-search-toggle"
              onClick={() => onNavigate('produtos')}
              aria-label="Buscar produtos"
            >
              <Search size={20} />
            </button>
            <button
              className="mobile-toggle"
              onClick={onToggleMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="main-navigation"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={reduce ? false : { opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'grid', placeItems: 'center' }}
                >
                  {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {mobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          onClick={onToggleMenu}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}

/* ───────────────────────── HOME ───────────────────────── */

type HomeProps = {
  onNavigate: (hash: string) => void;
  onWhatsApp: (product?: Product) => void;
};

function Home({ onNavigate, onWhatsApp }: HomeProps) {
  const reduce = useReducedMotion();

  return (
    <main>
      {/* ── HERO CINEMATOGRÁFICO ── */}
      <section className="hero">
        <motion.div
          className="hero__media"
          variants={reduce ? undefined : imageReveal}
          initial={reduce ? false : 'hidden'}
          animate="visible"
          aria-hidden
        />
        <div className="hero__inner">
          <motion.div
            className="hero__copy"
            variants={reduce ? undefined : staggerContainer}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            <motion.span className="eyebrow" variants={textLine}>
              NG Store / Country & Casual
            </motion.span>
            <motion.h1 variants={textLine}>
              Invista no seu visual e na sua imagem.
            </motion.h1>
            <motion.p variants={textLine}>
              Country & Casual com estilo, qualidade e personalidade.
            </motion.p>
            <motion.div className="hero__actions" variants={staggerFast}>
              <motion.a
                className="primary-button"
                href="#produtos"
                variants={scaleIn}
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
              >
                Conheça nossa coleção <ArrowRight size={15} />
              </motion.a>
              <motion.button
                className="outline-button"
                onClick={() => onWhatsApp()}
                variants={scaleIn}
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
              >
                <MessageCircle size={15} /> Fale com uma consultora
              </motion.button>
            </motion.div>
            <motion.div className="hero__meta" variants={fadeIn}>
              <span>01</span>
              <span>/</span>
              <span>03</span>
              <span className="hero__progress" />
              <span>Editorial 2026</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          <span>Identidade</span>
          <span>Presença</span>
          <span>Autenticidade</span>
          <span>Country & Casual</span>
          <span>Identidade</span>
          <span>Presença</span>
          <span>Autenticidade</span>
          <span>Country & Casual</span>
        </div>
      </div>

      {/* Intro */}
      <MotionSection className="intro" amount={0.25}>
        <div className="container intro__grid">
          <MotionItem className="intro__title">
            Uma nova leitura do vestir
            <strong>Estilo é a forma como a sua presença chega antes de você.</strong>
          </MotionItem>
          <MotionItem className="intro__copy">
            <p>
              A NG Store nasceu para quem entende que roupa é expressão. Nosso olhar combina a
              força da estética country com a leveza do casual, criando escolhas que acompanham a
              sua personalidade e valorizam a sua imagem.
            </p>
            <p>
              Este catálogo apresenta uma seleção demonstrativa para materializar a experiência
              digital da marca. As peças, preços e imagens devem ser substituídos pelo catálogo
              oficial na próxima etapa.
            </p>
            <a className="text-link" href="#contato">
              Conheça a NG Store <ArrowRight size={15} />
            </a>
          </MotionItem>
        </div>
      </MotionSection>

      {/* Categories */}
      <MotionSection className="category-section" stagger amount={0.15}>
        <div className="container">
          <div className="section-topline">
            <MotionItem className="section-heading">
              <span className="eyebrow">Curadoria NG</span>
              <h2>Nossas categorias</h2>
              <p>Encontre o estilo ideal para cada ocasião, com peças pensadas para criar presença.</p>
            </MotionItem>
            <MotionItem>
              <a href="#produtos" className="text-link">
                Ver todas as categorias <ArrowRight size={15} />
              </a>
            </MotionItem>
          </div>
          <div className="category-strip">
            {categories.map((category, i) => (
              <motion.a
                href={`#produtos?categoria=${category.id}`}
                className="category-card"
                key={category.id}
                variants={fadeUp}
                custom={i}
                whileHover={
                  reduce
                    ? undefined
                    : { y: -4, transition: { duration: 0.35, ease: ease.out } }
                }
              >
                <img src={category.image} alt={category.label} loading="lazy" />
                <div className="category-card__content">
                  <h3>{category.label}</h3>
                  <p>{category.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Featured products */}
      <MotionSection className="products-section" amount={0.12}>
        <div className="container">
          <MotionDiv className="section-topline" amount={0.3}>
            <div className="section-heading">
              <span className="eyebrow">Seleção demonstrativa</span>
              <h2>Produtos em destaque</h2>
              <p>Uma vitrine de referência para apresentar a experiência de descoberta e atendimento.</p>
            </div>
            <a href="#produtos" className="text-link">
              Ver todos os produtos <ArrowRight size={15} />
            </a>
          </MotionDiv>
          <motion.div
            className="product-grid"
            variants={reduce ? undefined : staggerContainer}
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {products
              .filter((product) => product.featured)
              .slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={(id) => onNavigate(`produto/${id}`)}
                  onWhatsApp={onWhatsApp}
                />
              ))}
          </motion.div>
        </div>
      </MotionSection>

      {/* Editorial */}
      <MotionSection className="editorial" amount={0.2}>
        <div className="container editorial__grid">
          <MotionItem className="editorial__image" />
          <MotionItem className="editorial__copy">
            <span className="eyebrow">Coleção em destaque</span>
            <h2>O essencial nunca é básico.</h2>
            <p>Texturas, proporções e detalhes que deixam o visual mais forte sem perder a naturalidade.</p>
            <a className="outline-button" href="#produtos">
              Explorar seleção <ArrowRight size={15} />
            </a>
          </MotionItem>
        </div>
      </MotionSection>

      <ServiceSection onWhatsApp={onWhatsApp} onNavigate={onNavigate} />
      <InstagramBand />
    </main>
  );
}

function ServiceSection({
  onWhatsApp,
  onNavigate,
}: {
  onWhatsApp: () => void;
  onNavigate: (hash: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <MotionSection className="service-section" stagger amount={0.15}>
      <div className="container">
        <MotionItem className="section-heading">
          <span className="eyebrow">Viva a experiência</span>
          <h2>Mais do que vestir. É sobre se reconhecer.</h2>
        </MotionItem>
        <div className="service-grid">
          <motion.article
            className="service-card"
            variants={fadeUp}
            whileHover={reduce ? undefined : { y: -4 }}
          >
            <img
              src="https://images.pexels.com/photos/31966332/pexels-photo-31966332.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Mulher usando chapéu em ambiente country"
              loading="lazy"
            />
            <div className="service-card__content">
              <h3>Consultoria de imagem</h3>
              <p>
                Descubra o poder de uma imagem bem construída, no seu ritmo e com atendimento
                próximo.
              </p>
              <button className="outline-button" onClick={onWhatsApp}>
                Solicitar atendimento <ArrowRight size={15} />
              </button>
            </div>
          </motion.article>
          <motion.article
            className="service-card"
            variants={fadeUp}
            whileHover={reduce ? undefined : { y: -4 }}
          >
            <img
              src="https://images.pexels.com/photos/8306368/pexels-photo-8306368.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Interior de boutique de moda"
              loading="lazy"
            />
            <div className="service-card__content">
              <h3>Nossa loja</h3>
              <p>Em Jardim, Mato Grosso do Sul. Um espaço para descobrir seu próximo visual.</p>
              <button className="outline-button" onClick={() => onNavigate('loja')}>
                Conheça a loja <ArrowRight size={15} />
              </button>
            </div>
          </motion.article>
        </div>
      </div>
    </MotionSection>
  );
}

function InstagramBand() {
  return (
    <MotionSection className="instagram-band" amount={0.3}>
      <div className="container instagram-band__inner">
        <MotionItem className="instagram-band__title">
          <Instagram size={40} strokeWidth={1.3} />
          <div>
            <h3>Siga nosso Instagram</h3>
            <p>Acompanhe novidades, lançamentos e muito mais.</p>
          </div>
        </MotionItem>
        <MotionItem>
          <a
            className="outline-button"
            href={contactConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Acessar perfil <ArrowRight size={15} />
          </a>
        </MotionItem>
      </div>
    </MotionSection>
  );
}

/* ───────────────────────── PRODUCTS PAGE ───────────────────────── */

function ProductsPage({
  initialCategory,
  onOpenProduct,
  onWhatsApp,
}: {
  initialCategory?: ProductCategory;
  onOpenProduct: (id: string) => void;
  onWhatsApp: (product: Product) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ProductCategory>(initialCategory ?? 'all');
  const [sort, setSort] = useState('featured');
  const reduce = useReducedMotion();

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery = `${product.name} ${product.categoryLabel}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    if (sort === 'lowest') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'highest') return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, query, sort]);

  return (
    <main className="page">
      <div className="container">
        <MotionDiv className="page__intro" amount={0.3}>
          <div>
            <span className="eyebrow">Catálogo demonstrativo</span>
            <h1>Escolhas com identidade.</h1>
          </div>
          <p>
            Pesquise por nome, explore categorias e abra cada peça para conhecer a experiência de
            atendimento personalizada.
          </p>
        </MotionDiv>

        <MotionDiv className="filters" amount={0.4}>
          <div className="filter-list">
            <button
              className={`filter-button${category === 'all' ? ' is-active' : ''}`}
              onClick={() => setCategory('all')}
            >
              Todos
            </button>
            {categories.map((item) => (
              <button
                className={`filter-button${category === item.id ? ' is-active' : ''}`}
                key={item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="filter-list">
            <label className="search-box">
              <Search size={14} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar..."
                aria-label="Buscar no catálogo"
              />
            </label>
            <select
              className="sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Ordenar produtos"
            >
              <option value="featured">Destaques</option>
              <option value="lowest">Menor preço</option>
              <option value="highest">Maior preço</option>
            </select>
          </div>
        </MotionDiv>

        <AnimatePresence mode="wait">
          {filteredProducts.length ? (
            <motion.div
              key={`${category}-${query}-${sort}`}
              className="product-grid"
              variants={reduce ? undefined : staggerContainer}
              initial={reduce ? false : 'hidden'}
              animate="visible"
              exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={onOpenProduct}
                  onWhatsApp={onWhatsApp}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="empty-state"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Nenhuma peça encontrada para essa busca.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ───────────────────────── PRODUCT DETAIL ───────────────────────── */

function ProductPage({
  productId,
  onBack,
  onOpenProduct,
  onWhatsApp,
}: {
  productId: string;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
  onWhatsApp: (product: Product) => void;
}) {
  const product = getProductById(productId);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const reduce = useReducedMotion();
  const { addItem } = useCart();

  if (!product) {
    return (
      <main className="page">
        <div className="container empty-state">
          Produto não encontrado.{' '}
          <button className="text-link" onClick={onBack}>
            Voltar ao catálogo
          </button>
        </div>
      </main>
    );
  }

  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 3);

  return (
    <main className="product-detail">
      <div className="container">
        <motion.button
          className="back-link"
          onClick={onBack}
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={14} /> Voltar ao catálogo
        </motion.button>

        <div className="detail-grid">
          <motion.div
            className="detail-gallery"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out }}
          >
            <div className="detail-gallery__thumbs">
              {product.gallery.map((image, index) => (
                <button
                  key={image}
                  className={`detail-gallery__thumb${activeImage === index ? ' is-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Imagem ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
            <button
              className="detail-gallery__main"
              onClick={() => setGalleryOpen(true)}
              aria-label="Ampliar imagem do produto"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.gallery[activeImage]}
                  alt={product.name}
                  variants={reduce ? undefined : galleryImage}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />
              </AnimatePresence>
              <span className="detail-gallery__zoom">
                <Search size={17} />
              </span>
            </button>
          </motion.div>

          <motion.div
            className="detail-copy"
            variants={reduce ? undefined : staggerContainer}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            <motion.span className="eyebrow" variants={textLine}>
              {product.categoryLabel}
            </motion.span>
            <motion.h1 variants={textLine}>{product.name}</motion.h1>
            <motion.div className="detail-copy__price" variants={textLine}>
              {formatPrice(product.price)}
            </motion.div>
            <motion.p className="detail-copy__description" variants={textLine}>
              {product.description}
            </motion.p>
            <motion.ul className="detail-list" variants={textLine}>
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </motion.ul>
            <motion.div className="detail-actions" variants={scaleIn}>
              <div className="qty-control detail-qty" role="group" aria-label="Quantidade">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  addItem(product, qty);
                  setQty(1);
                }}
              >
                Adicionar ao carrinho
              </button>
            </motion.div>
            <motion.button
              className="outline-button"
              onClick={() => onWhatsApp(product)}
              variants={scaleIn}
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              style={{ marginTop: 12 }}
            >
              <MessageCircle size={15} /> Consultar só este produto
            </motion.button>
            <motion.p className="demo-note" variants={fadeIn}>
              Os valores e informações desta vitrine são demonstrativos e não representam
              disponibilidade comercial real.
            </motion.p>
          </motion.div>
        </div>

        {related.length > 0 && (
          <MotionSection className="related" stagger amount={0.15}>
            <MotionItem>
              <h2>Você também pode gostar</h2>
            </MotionItem>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onOpen={onOpenProduct}
                  onWhatsApp={onWhatsApp}
                />
              ))}
            </div>
          </MotionSection>
        )}
      </div>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ampliada de ${product.name}`}
            onClick={() => setGalleryOpen(false)}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="gallery-lightbox__close"
              onClick={() => setGalleryOpen(false)}
              aria-label="Fechar imagem ampliada"
            >
              <X size={24} />
            </button>
            <motion.img
              src={product.gallery[activeImage]}
              alt={product.name}
              onClick={(event) => event.stopPropagation()}
              initial={reduce ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mobile-product-cta-bar">
        <button
          type="button"
          className="mobile-product-cta mobile-product-cta--cart"
          onClick={() => addItem(product, qty)}
        >
          Adicionar ao carrinho
        </button>
        <button
          type="button"
          className="mobile-product-cta mobile-product-cta--wa"
          onClick={() => onWhatsApp(product)}
          aria-label="Consultar no WhatsApp"
        >
          <MessageCircle size={17} />
        </button>
      </div>
    </main>
  );
}

/* ───────────────────────── CONSULTORIA ───────────────────────── */

function ConsultoriaPage({ onWhatsApp }: { onWhatsApp: () => void }) {
  const reduce = useReducedMotion();

  return (
    <main className="page">
      <div className="container">
        <div className="contact-grid">
          <motion.div
            variants={reduce ? undefined : staggerContainer}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            <motion.span className="eyebrow" variants={textLine}>
              Atendimento próximo
            </motion.span>
            <motion.h1
              className="serif"
              style={{ fontSize: 'clamp(58px, 8vw, 104px)', lineHeight: '.84', margin: '16px 0' }}
              variants={textLine}
            >
              Sua imagem, mais intencional.
            </motion.h1>
            <motion.p
              style={{ color: 'var(--muted)', lineHeight: 1.8, maxWidth: 430 }}
              variants={textLine}
            >
              A consultoria residencial e on-line da NG Store nasce para tornar suas escolhas mais
              simples, coerentes e alinhadas com quem você é.
            </motion.p>
            <motion.button
              className="primary-button"
              onClick={onWhatsApp}
              variants={scaleIn}
              whileHover={reduce ? undefined : { y: -3 }}
            >
              Solicitar atendimento <ArrowRight size={15} />
            </motion.button>
          </motion.div>
          <motion.div
            className="editorial__image"
            style={{
              minHeight: 520,
              backgroundImage:
                "url('https://images.pexels.com/photos/31966332/pexels-photo-31966332.jpeg?auto=compress&cs=tinysrgb&w=1400')",
            }}
            initial={reduce ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: ease.expo }}
          />
        </div>
        <MotionSection className="intro" style={{ paddingBottom: 0 }} amount={0.2}>
          <div className="intro__grid">
            <MotionItem className="intro__title">
              Como podemos ajudar
              <strong>Escolhas mais seguras para a sua rotina.</strong>
            </MotionItem>
            <MotionItem className="intro__copy">
              <p>
                Converse com a nossa equipe para entender o que faz sentido para o seu estilo, o
                seu corpo e o momento que você está vivendo. O atendimento pode ser presencial ou
                online.
              </p>
            </MotionItem>
          </div>
        </MotionSection>
      </div>
    </main>
  );
}

/* ───────────────────────── LOJA ───────────────────────── */

function StorePage({ onNavigate }: { onNavigate: (hash: string) => void }) {
  const reduce = useReducedMotion();

  return (
    <main className="page">
      <div className="container">
        <MotionDiv className="page__intro" amount={0.3}>
          <div>
            <span className="eyebrow">Espaço físico</span>
            <h1>Nossa loja em Jardim.</h1>
          </div>
          <p>
            Um ambiente pensado para você experimentar, conversar e encontrar peças que combinam
            com a sua presença.
          </p>
        </MotionDiv>
        <motion.div
          className="editorial__image"
          style={{
            minHeight: 420,
            marginBottom: 48,
            backgroundImage:
              "url('https://images.pexels.com/photos/8306368/pexels-photo-8306368.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
          initial={reduce ? false : { opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: ease.expo }}
        />
        <MotionDiv className="intro__copy" style={{ maxWidth: 560 }} amount={0.3}>
          <p>
            Localizada em Jardim, Mato Grosso do Sul, a NG Store recebe quem busca moda country e
            casual com atendimento próximo e consultoria de imagem.
          </p>
          <p style={{ marginTop: 16, color: 'var(--muted)' }}>
            {contactConfig.location} · {contactConfig.hours}
          </p>
          <button className="outline-button" style={{ marginTop: 28 }} onClick={() => onNavigate('contato')}>
            Fale conosco <ArrowRight size={15} />
          </button>
        </MotionDiv>
      </div>
    </main>
  );
}

/* ───────────────────────── CONTATO ───────────────────────── */

function ContactPage({ onWhatsApp }: { onWhatsApp: () => void }) {
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="contact-grid">
          <motion.div
            variants={reduce ? undefined : staggerContainer}
            initial={reduce ? false : 'hidden'}
            animate="visible"
          >
            <motion.div className="contact-list" variants={staggerContainer}>
              <motion.div className="contact-item" variants={textLine}>
                <MessageCircle size={19} />
                <div>
                  <strong>WhatsApp</strong>
                  <span>
                    {contactConfig.whatsappNumber
                      ? 'Atendimento disponível'
                      : 'Número oficial a confirmar'}
                  </span>
                </div>
              </motion.div>
              <motion.div className="contact-item" variants={textLine}>
                <Instagram size={19} />
                <div>
                  <strong>Instagram</strong>
                  <a href={contactConfig.instagramUrl} target="_blank" rel="noreferrer">
                    {contactConfig.instagramHandle}
                  </a>
                </div>
              </motion.div>
              <motion.div className="contact-item" variants={textLine}>
                <MapPin size={19} />
                <div>
                  <strong>Localização</strong>
                  <span>{contactConfig.location}</span>
                </div>
              </motion.div>
              <motion.div className="contact-item" variants={textLine}>
                <Store size={19} />
                <div>
                  <strong>Horários</strong>
                  <span>{contactConfig.hours}</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.button
              className="primary-button"
              style={{ marginTop: 27 }}
              onClick={onWhatsApp}
              variants={scaleIn}
              whileHover={reduce ? undefined : { y: -3 }}
            >
              <MessageCircle size={15} /> Chamar no WhatsApp
            </motion.button>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ease.out, delay: 0.15 }}
          >
            <h2>Envie uma mensagem.</h2>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Seu nome</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  inputMode="text"
                  required
                  placeholder="Como podemos chamar você?"
                />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="seu@email.com"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Conte um pouco sobre o que você procura..."
                />
              </div>
            </div>
            <button className="primary-button" type="submit">
              Enviar mensagem <ArrowRight size={15} />
            </button>
            {sent && (
              <p className="success-message" role="status">
                Mensagem registrada nesta demonstração. O canal de envio oficial será conectado na
                próxima etapa.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </main>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer({ onNavigate }: { onNavigate: (hash: string) => void }) {
  return (
    <MotionSection as="footer" className="footer" amount={0.2} stagger>
      <div className="container">
        <div className="footer__grid">
          <MotionItem className="footer__column">
            <button className="brand-button" onClick={() => onNavigate('')}>
              <BrandMark />
            </button>
            <p style={{ marginTop: 20, maxWidth: 190 }}>
              Moda Country & Casual com estilo, qualidade e personalidade.
            </p>
          </MotionItem>
          <MotionItem className="footer__column">
            <h4>Navegação</h4>
            <a href="#">Início</a>
            <a href="#produtos">Produtos</a>
            <a href="#consultoria">Consultoria</a>
            <a href="#loja">Nossa loja</a>
          </MotionItem>
          <MotionItem className="footer__column">
            <h4>Atendimento</h4>
            <a href="#contato">Contato</a>
            <a href={contactConfig.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <p>Jardim — MS</p>
          </MotionItem>
          <MotionItem className="footer__column">
            <h4>Manifesto</h4>
            <p className="footer__tagline">“Invista no seu visual e na sua imagem.”</p>
          </MotionItem>
        </div>
        <MotionItem className="footer__bottom">
          <span>© 2026 NG Store. Todos os direitos reservados.</span>
          <span>Experiência digital demonstrativa</span>
        </MotionItem>
      </div>
    </MotionSection>
  );
}

export default App;
