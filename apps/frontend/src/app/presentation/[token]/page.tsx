'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PresentationFooter } from '../../../components/presentation/PresentationFooter';
import { SlidesSidebar } from '../../../components/presentation/SlidesSidebar';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import ClientOnly from '../../../components/ClientOnly';
import { MaterialIcon, MaterialIconLarge, MaterialIconList } from '../../../components/presentation/MaterialIcon';
// Importaciones directas de CSS para compatibilidad con Turbopack
import '../../../styles/presentations/base.css';
import '../../../styles/presentations/typography.css';
import '../../../styles/presentations/slides/cover.css';
import '../../../styles/presentations/slides/index.css';
import '../../../styles/presentations/slides/section_index.css';
import '../../../styles/presentations/slides/content.css';
import '../../../styles/presentations/slides/highlight.css';
import '../../../styles/presentations/slides/keypoints.css';
import '../../../styles/presentations/slides/metrics.css';
import '../../../styles/presentations/slides/quote.css';
import '../../../styles/presentations/slides/image.css';
import '../../../styles/presentations/slides/video.css';
import '../../../styles/presentations/slides/closing.css';
import '../../../styles/presentations/slides/title.css';
import '../../../styles/presentations/components/toolbar.css';
import '../../../styles/presentations/icons.css';

interface Slide {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: any[];
  elements?: any[];
  narration?: string;
  contextLinks?: any[];
}

interface Presentation {
  id: string;
  title: string;
  description: string;
  status: string;
  content: {
    slides: Slide[];
  };
  accessToken: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

export default function PresentationPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Nuevos estados para el UI/UX
  const [mode, setMode] = useState<'manual' | 'narrated'>('manual');
  const [isPresenting, setIsPresenting] = useState(false);
  const [handState, setHandState] = useState<'normal' | 'raised' | 'listening'>('normal');

  useEffect(() => {
    if (token) {
      loadPresentation();
    }
  }, [token]);

  const loadPresentation = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/presentations/public/${token}`);
      
      if (!response.ok) {
        throw new Error('Presentación no encontrada');
      }
      
      const data = await response.json();
      setPresentation(data);
      
      // Track presentation start after setting presentation
      try {
        await fetch(`${API_BASE_URL}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            presentationId: data.id,
            eventType: 'PRESENTATION_START',
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            metadata: { token },
          }),
        });
      } catch (trackError) {
        console.error('Analytics tracking failed:', trackError);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar la presentación');
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (eventType: string, metadata: any = {}) => {
    if (!presentation?.id) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presentationId: presentation.id,
          eventType,
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          metadata,
        }),
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  const nextSlide = () => {
    if (presentation && currentSlide < presentation.content.slides.length - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      trackEvent('SLIDE_VIEW', { slideId: presentation.content.slides[newSlide].id });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && presentation) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
      trackEvent('SLIDE_VIEW', { slideId: presentation.content.slides[newSlide].id });
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (presentation) {
      trackEvent('SLIDE_VIEW', { slideId: presentation.content.slides[index].id });
    }
  };

  const goHome = () => {
    setCurrentSlide(0);
    if (presentation) {
      trackEvent('SLIDE_VIEW', { slideId: presentation.content.slides[0].id });
    }
  };

  const togglePresentation = () => {
    const newPresentingState = !isPresenting;
    setIsPresenting(newPresentingState);
    
    if (newPresentingState) {
      setMode('narrated');
      trackEvent('PRESENTATION_START');
    } else {
      setMode('manual');
      setHandState('normal');
      trackEvent('PRESENTATION_STOP');
    }
  };

  const toggleHand = () => {
    if (mode === 'manual') return;
    
    const newHandState = handState === 'normal' ? 'raised' : 
                        handState === 'raised' ? 'listening' : 'normal';
    setHandState(newHandState);
    trackEvent('HAND_INTERACTION', { state: newHandState });
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    trackEvent('CHAT_TOGGLE', { open: !showChat });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Navegación por teclado
  useKeyboardNavigation({
    onPrevSlide: prevSlide,
    onNextSlide: nextSlide,
    onGoHome: goHome,
    onToggleChat: toggleChat,
    onToggleMenu: toggleMenu,
    disabled: isLoading || !presentation
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prisma-red mx-auto mb-4"></div>
          <p className="text-neutral-700">Cargando presentación...</p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-prisma-red-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-prisma-red text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Presentación no encontrada</h1>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-prisma-red hover:bg-prisma-red-hover text-white px-6 py-2 rounded-md transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const currentSlideData = presentation.content.slides[currentSlide];
  const progress = ((currentSlide + 1) / presentation.content.slides.length) * 100;

  // Función para renderizar elementos de slide v5
  const renderSlideElements = (elements: any[]) => {
    return elements.map((element, index) => {
      switch (element.type) {
        case 'text':
          return (
            <div key={index} className={`prisma-element__text ${element.style ? `prisma-element__text--${element.style}` : ''}`}>
              {element.content}
            </div>
          );
        
        case 'highlight':
          return (
            <div key={index} className={`prisma-highlight__badge ${element.variant ? `prisma-highlight__badge--${element.variant}` : ''}`}>
              {element.icon && <MaterialIcon name={element.icon} variant="twotone" size="medium" />}
              <span>{element.content}</span>
            </div>
          );
        
        case 'keypoints':
          return (
            <div key={index} className="prisma-keypoints__container">
              {element.title && <h3 className="prisma-keypoints__title">{element.title}</h3>}
              <div className="prisma-keypoints__grid">
                {element.items?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="prisma-keypoints__card">
                    {item.number && <div className="prisma-keypoints__number">{item.number}</div>}
                    {item.icon && <MaterialIconLarge name={item.icon} />}
                    <div className="prisma-keypoints__content">
                      <h4 className="prisma-keypoints__item-title">{item.text}</h4>
                      {item.description && <p className="prisma-keypoints__description">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        
        case 'metrics':
          return (
            <div key={index} className="prisma-metrics__container">
              {element.title && <h3 className="prisma-metrics__title">{element.title}</h3>}
              <div className="prisma-metrics__grid">
                {element.items?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className={`prisma-metrics__card ${item.color ? `prisma-metrics__card--${item.color}` : ''}`}>
                    {item.icon && <MaterialIconLarge name={item.icon} />}
                    <div className="prisma-metrics__value">{item.value}</div>
                    <div className="prisma-metrics__label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        
        case 'link':
          return (
            <div key={index} className="prisma-element__link">
              {element.text}
              <a href="#" className="prisma-link">{element.linkText}</a>
              {element.afterText}
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  // Función para renderizar el contenido según el tipo de slide
  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'cover':
        return (
          <div className="prisma-cover__container">
            {slide.title && (
              <h1 className="prisma-cover__title">{slide.title}</h1>
            )}
            {slide.subtitle && (
              <p className="prisma-cover__subtitle">{slide.subtitle}</p>
            )}
            {slide.elements && (
              <div className="prisma-cover__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
            {slide.content && (
              <div className="prisma-cover__content">
                {renderContent(slide.content)}
              </div>
            )}
          </div>
        );
      
      case 'index':
        return (
          <div className="prisma-index__container">
            {slide.title && (
              <div className="prisma-index__header">
                <h1 className="prisma-index__title">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="prisma-index__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            {slide.content && (
              <div className="prisma-index__content">
                {renderContent(slide.content)}
              </div>
            )}
            {slide.elements && (
              <div className="prisma-index__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
      
      case 'section_index':
        return (
          <div className="prisma-section-index__container">
            <div className="prisma-section-index__background"></div>
            <div className="prisma-section-index__content">
              {slide.title && (
                <h1 className="prisma-section-index__title">{slide.title}</h1>
              )}
              {slide.subtitle && (
                <p className="prisma-section-index__subtitle">{slide.subtitle}</p>
              )}
              {slide.content && (
                <div className="prisma-section-index__overview">
                  {renderContent(slide.content)}
                </div>
              )}
              {slide.elements && (
                <div className="prisma-section-index__elements">
                  {renderSlideElements(slide.elements)}
                </div>
              )}
              <div className="prisma-section-index__accent"></div>
            </div>
          </div>
        );
      
      case 'highlight':
        return (
          <div className="prisma-highlight__container">
            <div className="prisma-highlight__background"></div>
            <div className="prisma-highlight__content">
              <div className="prisma-highlight__badge">Destacado</div>
              {slide.title && (
                <h1 className="prisma-highlight__title">{slide.title}</h1>
              )}
              {slide.subtitle && (
                <p className="prisma-highlight__subtitle">{slide.subtitle}</p>
              )}
              {slide.content && (
                <div className="prisma-highlight__points">
                  {renderContent(slide.content)}
                </div>
              )}
              {slide.elements && (
                <div className="prisma-highlight__elements">
                  {renderSlideElements(slide.elements)}
                </div>
              )}
              <div className="prisma-highlight__accent-line"></div>
            </div>
          </div>
        );
      
      case 'keypoints':
        return (
          <div className="prisma-keypoints__container">
            {slide.title && (
              <div className="prisma-keypoints__header">
                <h1 className="prisma-keypoints__title">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="prisma-keypoints__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            {slide.content && (
              <div className="prisma-keypoints__grid">
                {renderContent(slide.content)}
              </div>
            )}
            {slide.elements && (
              <div className="prisma-keypoints__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
      
      case 'metrics':
        return (
          <div className="prisma-metrics__container">
            {slide.title && (
              <div className="prisma-metrics__header">
                <h1 className="prisma-metrics__title">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="prisma-metrics__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            {slide.content && (
              <div className="prisma-metrics__grid">
                {renderContent(slide.content)}
              </div>
            )}
            {slide.elements && (
              <div className="prisma-metrics__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
      
      case 'quote':
        return (
          <div className="prisma-quote__container">
            <div className="prisma-quote__background"></div>
            <div className="prisma-quote__content">
              <div className="prisma-quote__mark">"</div>
              {slide.title && (
                <blockquote className="prisma-quote__text">{slide.title}</blockquote>
              )}
              {slide.content && (
                <div className="prisma-quote__attribution">
                  {renderContent(slide.content)}
                </div>
              )}
              {slide.elements && (
                <div className="prisma-quote__elements">
                  {renderSlideElements(slide.elements)}
                </div>
              )}
              <div className="prisma-quote__accent-line"></div>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="prisma-image__container">
            {slide.title && (
              <div className="prisma-image__header">
                <h1 className="prisma-image__title">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="prisma-image__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            <div className="prisma-image__media-container">
              {slide.content && renderContent(slide.content)}
            </div>
            {slide.elements && (
              <div className="prisma-image__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="prisma-video__container">
            {slide.title && (
              <div className="prisma-video__header">
                <h1 className="prisma-video__title">{slide.title}</h1>
                {slide.subtitle && (
                  <p className="prisma-video__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            <div className="prisma-video__player-container">
              {slide.content && renderContent(slide.content)}
            </div>
            {slide.elements && (
              <div className="prisma-video__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
      
      case 'closing':
        return (
          <div className="prisma-closing__container">
            <div className="prisma-closing__background"></div>
            <div className="prisma-closing__content">
              {slide.title && (
                <h1 className="prisma-closing__title">{slide.title}</h1>
              )}
              {slide.subtitle && (
                <p className="prisma-closing__subtitle">{slide.subtitle}</p>
              )}
              {slide.content && (
                <div className="prisma-closing__message">
                  {renderContent(slide.content)}
                </div>
              )}
              {slide.elements && (
                <div className="prisma-closing__elements">
                  {renderSlideElements(slide.elements)}
                </div>
              )}
              <div className="prisma-closing__accent-line"></div>
            </div>
          </div>
        );
      
      case 'title':
        return (
          <div className="prisma-title__container">
            {slide.title && (
              <h1 className="prisma-title__main">{slide.title}</h1>
            )}
            {slide.subtitle && (
              <p className="prisma-title__subtitle">{slide.subtitle}</p>
            )}
            {slide.elements && (
              <div className="prisma-title__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
            <div className="prisma-title__accent"></div>
          </div>
        );
      
      case 'content':
      default:
        return (
          <div className="prisma-content__container">
            {slide.title && (
              <div className="prisma-content__header">
                <h2 className="prisma-content__title">{slide.title}</h2>
                {slide.subtitle && (
                  <p className="prisma-content__subtitle">{slide.subtitle}</p>
                )}
              </div>
            )}
            {slide.content && (
              <div className="prisma-content__block">
                {renderContent(slide.content)}
              </div>
            )}
            {slide.elements && (
              <div className="prisma-content__elements">
                {renderSlideElements(slide.elements)}
              </div>
            )}
          </div>
        );
    }
  };

  // Función auxiliar para renderizar contenido dinámico
  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <div className="prisma-content__text" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    if (Array.isArray(content)) {
      return content.map((item: any, index: number) => (
        <div key={item.id || index} className="prisma-content__block">
          {item.type === 'text' && (
            <div className="prisma-content__text">
              {item.data}
            </div>
          )}
          {item.type === 'image' && (
            <img 
              src={item.data} 
              alt={item.alt || 'Slide content'}
              className="prisma-content__image"
            />
          )}
          {item.type === 'list' && (
            <ul className="prisma-content__list">
              {Array.isArray(item.data) && item.data.map((listItem: string, i: number) => (
                <li key={i} className="prisma-content__list-item">{listItem}</li>
              ))}
            </ul>
          )}
        </div>
      ));
    }
    
    return null;
  };

  return (
    <ClientOnly fallback={
      <div className="prisma-presentation">
        <div className="prisma-loading">
          <div className="prisma-spinner"></div>
          <p className="prisma-text-body">Cargando presentación...</p>
        </div>
      </div>
    }>
      {/* Estructura v4: Sin marcos, pantalla completa */}
      <div className="prisma-presentation">
        {/* Barra de progreso */}
        <div 
          className="prisma-presentation__progress-bar"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />

        {/* Slide actual */}
        <div className={`prisma-slide prisma-slide--${currentSlideData.type || 'content'}`}>
          {/* Header del slide (opcional, solo si hay título) */}
          {currentSlideData.title && currentSlideData.type !== 'cover' && (
            <header className="prisma-slide__header">
              <h1 className="prisma-slide__title">{currentSlideData.title}</h1>
            </header>
          )}

          {/* Body del slide */}
          <div className={`prisma-slide__body ${
            ['cover', 'title', 'index', 'section_index', 'closing'].includes(currentSlideData.type || 'content') 
              ? 'prisma-slide__body--centered' 
              : ['image', 'video'].includes(currentSlideData.type || 'content')
              ? 'prisma-slide__body--media'
              : 'prisma-slide__body--content'
          }`}>
            {renderSlideContent(currentSlideData)}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="fixed top-0 right-0 w-96 h-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-40">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Chat Interactivo</h3>
              <p className="text-sm text-neutral-600 mt-1">Haz preguntas sobre la presentación</p>
            </div>
            
            <div className="flex-1 p-6">
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-neutral-700">
                  ¡Hola! Soy tu asistente de IA. Puedes hacerme preguntas sobre esta presentación.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-prisma-red focus:border-transparent"
                />
                <button
                  onClick={() => trackEvent('CHAT_INTERACTION', { message: 'Chat opened' })}
                  className="bg-prisma-red hover:bg-prisma-red-hover text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slides Sidebar */}
        <SlidesSidebar
          slides={presentation.content.slides}
          currentSlide={currentSlide}
          open={showMenu}
          onClose={() => setShowMenu(false)}
          onSlideSelect={goToSlide}
        />

        {/* Footer con Toolbar */}
        <PresentationFooter
          presentationTitle={presentation.title}
          slides={presentation.content.slides}
          currentSlide={currentSlide}
          totalSlides={presentation.content.slides.length}
          mode={mode}
          isPresenting={isPresenting}
          handState={handState}
          onPrevSlide={prevSlide}
          onNextSlide={nextSlide}
          onGoHome={goHome}
          onTogglePresentation={togglePresentation}
          onToggleHand={toggleHand}
          onSlideSelect={goToSlide}
          onToggleChat={toggleChat}
          onToggleMenu={toggleMenu}
        />
      </div>
    </ClientOnly>
  );
}
