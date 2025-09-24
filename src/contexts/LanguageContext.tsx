import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.book': 'Book Appointment',
    
    // Hero Section
    'hero.badge': 'Trusted Professional Services',
    'hero.title': 'Professional',
    'hero.title.highlight': 'Notary Services',
    'hero.title.end': 'You Can Trust',
    'hero.description': 'From mobile notary and loan signings to remote online notarization and tax preparation, we provide comprehensive professional services with integrity and convenience.',
    'hero.feature1': 'Licensed & Insured Notary',
    'hero.feature2': 'Mobile Services Available',
    'hero.feature3': 'Remote Online Notarization',
    'hero.feature4': 'Same-Day Appointments',
    'hero.cta.book': 'Book Your Appointment',
    'hero.cta.phone': '(908) 514-8180',
    'hero.stats.documents': 'Documents Notarized',
    'hero.stats.loans': 'Loan Signings',
    'hero.stats.satisfaction': 'Client Satisfaction',
    
    // Services Section
    'services.badge': 'Our Services',
    'services.title': 'Comprehensive Notary Solutions',
    'services.subtitle': 'Professional services tailored to meet your document authentication and signing needs.',
    'services.mobile.title': 'Mobile Notary',
    'services.mobile.description': 'Convenient on-site notary services at your location.',
    'services.mobile.feature1': 'Travel to your location',
    'services.mobile.feature2': 'Flexible scheduling',
    'services.mobile.feature3': 'Professional service',
    'services.mobile.feature4': 'Licensed & bonded',
    'services.mobile.price': 'From $25',
    'services.loan.title': 'Loan Signings',
    'services.loan.description': 'Specialized in real estate loan document signings.',
    'services.loan.feature1': 'Real estate expertise',
    'services.loan.feature2': 'Error-free signings',
    'services.loan.feature3': 'Same-day service',
    'services.loan.feature4': 'Title company approved',
    'services.loan.price': 'From $100',
    'services.ron.title': 'Remote Online Notarization',
    'services.ron.description': 'Secure online notarization from anywhere.',
    'services.ron.feature1': 'Secure video platform',
    'services.ron.feature2': 'Digital document signing',
    'services.ron.feature3': 'Identity verification',
    'services.ron.feature4': 'Legally compliant',
    'services.ron.price': 'From $35',
    'services.apostille.title': 'Apostille Services',
    'services.apostille.description': 'Document authentication for international use.',
    'services.apostille.feature1': 'International authentication',
    'services.apostille.feature2': 'Document preparation',
    'services.apostille.feature3': 'Fast processing',
    'services.apostille.feature4': 'Secure handling',
    'services.apostille.price': 'From $50',
    'services.learn': 'Learn More',
    'services.popular': 'Most Popular',
    'services.areas.title': 'Service Areas',
    'services.areas.availability': 'Mobile Service Available',
    'services.areas.same_day': 'Same-Day Appointments',
    
    // About Section
    'about.badge': 'About Us',
    'about.title': 'Licensed Professional You Can Trust',
    'about.description': 'With years of experience in notary services and document authentication, we provide reliable, professional services with the highest standards of integrity and confidentiality.',
    'about.certification.title': 'Professional Certifications',
    'about.certification.description': 'Licensed, bonded, and insured with all required state certifications for your peace of mind.',
    'about.experience.title': 'Years of Experience',
    'about.experience.description': 'Extensive experience in all types of notarial acts and document authentication services.',
    'about.mobile.title': 'Mobile Service',
    'about.mobile.description': 'Convenient on-site services at your home, office, or any location of your choice.',
    'about.stats.certifications': 'Professional Certifications',
    'about.stats.experience': 'Years Experience',
    'about.stats.documents': 'Documents Processed',
    'about.stats.satisfaction': 'Satisfaction Rate',
    
    // Testimonials Section
    'testimonials.badge': 'Client Testimonials',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Real experiences from satisfied clients who trust our professional notary services.',
    'testimonials.stats.professional': 'Professional Service',
    'testimonials.stats.satisfaction': 'Client Satisfaction',
    
    // Contact Section
    'contact.badge': 'Contact Us',
    'contact.title': 'Ready to Get Started?',
    'contact.subtitle': 'Contact us today to schedule your notary appointment or get answers to your questions.',
    'contact.info.location': 'Our Location',
    'contact.info.location.address': '180 Talmadge Road, Unit 1380, Edison, NJ 08817',
    'contact.info.phone': 'Phone Number',
    'contact.info.email': 'Email Address',
    'contact.info.hours': 'Business Hours',
    'contact.info.hours.schedule': 'Mon-Sun: 8AM-8PM',
    'contact.info.hours.description': 'Monday through Sunday availability',
    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.service': 'Service Needed',
    'contact.form.service.mobile': 'Mobile Notary',
    'contact.form.service.loan': 'Loan Signing',
    'contact.form.service.ron': 'Remote Notarization',
    'contact.form.service.apostille': 'Apostille Service',
    'contact.form.service.other': 'Other Services',
    'contact.form.timing': 'Preferred Timing',
    'contact.form.timing.morning': 'Morning (8AM-12PM)',
    'contact.form.timing.afternoon': 'Afternoon (12PM-5PM)',
    'contact.form.timing.evening': 'Evening (5PM-8PM)',
    'contact.form.timing.flexible': 'Flexible Timing',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.response': "We'll respond within 2 hours during business hours.",
    'contact.hours.monday': 'Monday - Friday',
    'contact.hours.saturday': 'Saturday',
    'contact.hours.sunday': 'Sunday',
    'contact.hours.appointment': 'By appointment only',
    'contact.hours.appointment_only': 'By Appointment Only',
    'contact.emergency.title': 'Professional Services',
    'contact.emergency.description': 'Licensed, bonded, and insured notary services with flexible scheduling to meet your needs.',
    
    // Footer
    'footer.company': 'Notary & Signings LLC',
    'footer.description': 'Professional notary services you can trust. Licensed, bonded, and insured for your peace of mind. Serving the community with integrity and excellence.',
    'footer.quick_links': 'Quick Links',
    'footer.services': 'Our Services',
    'footer.credentials': 'Professional Credentials',
    'footer.licensed': 'Licensed Notary',
    'footer.licensed_desc': 'State Certified',
    'footer.bonded': 'Bonded & Insured',
    'footer.bonded_desc': '$100K Coverage',
    'footer.ron_certified': 'RON Certified',
    'footer.ron_desc': 'Remote Notarization',
    'footer.professional_services': 'Professional Services',
    'footer.professional_desc': 'Licensed, bonded, and insured notary services with flexible scheduling.',
    'footer.schedule': 'Schedule Appointment',
    'footer.copyright': '© 2024 Notary and Signings LLC. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.services': 'Servicios',
    'nav.testimonials': 'Testimonios',
    'nav.contact': 'Contacto',
    'nav.book': 'Reservar Cita',
    
    // Hero Section
    'hero.badge': 'Servicios Profesionales de Confianza',
    'hero.title': 'Servicios',
    'hero.title.highlight': 'Notariales Profesionales',
    'hero.title.end': 'en los que Puedes Confiar',
    'hero.description': 'Desde notario móvil y firmas de préstamos hasta notarización remota en línea y preparación de impuestos, brindamos servicios profesionales integrales con integridad y conveniencia.',
    'hero.feature1': 'Notario Licenciado y Asegurado',
    'hero.feature2': 'Servicios Móviles Disponibles',
    'hero.feature3': 'Notarización Remota en Línea',
    'hero.feature4': 'Citas el Mismo Día',
    'hero.cta.book': 'Reserva tu Cita',
    'hero.cta.phone': '(908) 514-8180',
    'hero.stats.documents': 'Documentos Notarizados',
    'hero.stats.loans': 'Firmas de Préstamos',
    'hero.stats.satisfaction': 'Satisfacción del Cliente',
    
    // Services Section
    'services.badge': 'Nuestros Servicios',
    'services.title': 'Soluciones Notariales Integrales',
    'services.subtitle': 'Servicios profesionales diseñados para satisfacer sus necesidades de autenticación y firma de documentos.',
    'services.mobile.title': 'Notario Móvil',
    'services.mobile.description': 'Servicios notariales convenientes en el sitio en su ubicación.',
    'services.mobile.feature1': 'Viajamos a su ubicación',
    'services.mobile.feature2': 'Horarios flexibles',
    'services.mobile.feature3': 'Servicio profesional',
    'services.mobile.feature4': 'Licenciado y con garantía',
    'services.mobile.price': 'Desde $25',
    'services.loan.title': 'Firmas de Préstamos',
    'services.loan.description': 'Especializado en firmas de documentos de préstamos inmobiliarios.',
    'services.loan.feature1': 'Experiencia en bienes raíces',
    'services.loan.feature2': 'Firmas sin errores',
    'services.loan.feature3': 'Servicio el mismo día',
    'services.loan.feature4': 'Aprobado por compañías de títulos',
    'services.loan.price': 'Desde $100',
    'services.ron.title': 'Notarización Remota en Línea',
    'services.ron.description': 'Notarización segura en línea desde cualquier lugar.',
    'services.ron.feature1': 'Plataforma de video segura',
    'services.ron.feature2': 'Firma digital de documentos',
    'services.ron.feature3': 'Verificación de identidad',
    'services.ron.feature4': 'Legalmente conforme',
    'services.ron.price': 'Desde $35',
    'services.apostille.title': 'Servicios de Apostilla',
    'services.apostille.description': 'Autenticación de documentos para uso internacional.',
    'services.apostille.feature1': 'Autenticación internacional',
    'services.apostille.feature2': 'Preparación de documentos',
    'services.apostille.feature3': 'Procesamiento rápido',
    'services.apostille.feature4': 'Manejo seguro',
    'services.apostille.price': 'Desde $50',
    'services.learn': 'Más Información',
    'services.popular': 'Más Popular',
    'services.areas.title': 'Áreas de Servicio',
    'services.areas.availability': 'Servicio Móvil Disponible',
    'services.areas.same_day': 'Citas el Mismo Día',
    
    // About Section
    'about.badge': 'Acerca de Nosotros',
    'about.title': 'Profesional Licenciado en Quien Puedes Confiar',
    'about.description': 'Con años de experiencia en servicios notariales y autenticación de documentos, brindamos servicios confiables y profesionales con los más altos estándares de integridad y confidencialidad.',
    'about.certification.title': 'Certificaciones Profesionales',
    'about.certification.description': 'Licenciado, con garantía y asegurado con todas las certificaciones estatales requeridas para su tranquilidad.',
    'about.experience.title': 'Años de Experiencia',
    'about.experience.description': 'Amplia experiencia en todo tipo de actos notariales y servicios de autenticación de documentos.',
    'about.mobile.title': 'Servicio Móvil',
    'about.mobile.description': 'Servicios convenientes en el sitio en su hogar, oficina o cualquier ubicación de su elección.',
    'about.stats.certifications': 'Certificaciones Profesionales',
    'about.stats.experience': 'Años de Experiencia',
    'about.stats.documents': 'Documentos Procesados',
    'about.stats.satisfaction': 'Índice de Satisfacción',
    
    // Testimonials Section
    'testimonials.badge': 'Testimonios de Clientes',
    'testimonials.title': 'Lo que Dicen Nuestros Clientes',
    'testimonials.subtitle': 'Experiencias reales de clientes satisfechos que confían en nuestros servicios notariales profesionales.',
    'testimonials.stats.professional': 'Servicio Profesional',
    'testimonials.stats.satisfaction': 'Satisfacción del Cliente',
    
    // Contact Section
    'contact.badge': 'Contáctanos',
    'contact.title': '¿Listo para Comenzar?',
    'contact.subtitle': 'Contáctanos hoy para programar tu cita notarial u obtener respuestas a tus preguntas.',
    'contact.info.location': 'Nuestra Ubicación',
    'contact.info.location.address': '180 Talmadge Road, Unit 1380, Edison, NJ 08817',
    'contact.info.phone': 'Número de Teléfono',
    'contact.info.email': 'Dirección de Correo',
    'contact.info.hours': 'Horario Comercial',
    'contact.info.hours.schedule': 'Lun-Dom: 8AM-8PM',
    'contact.info.hours.description': 'Disponibilidad de lunes a domingo',
    'contact.form.title': 'Envíanos un Mensaje',
    'contact.form.name': 'Nombre Completo',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.phone': 'Número de Teléfono',
    'contact.form.service': 'Servicio Necesario',
    'contact.form.service.mobile': 'Notario Móvil',
    'contact.form.service.loan': 'Firma de Préstamo',
    'contact.form.service.ron': 'Notarización Remota',
    'contact.form.service.apostille': 'Servicio de Apostilla',
    'contact.form.service.other': 'Otros Servicios',
    'contact.form.timing': 'Horario Preferido',
    'contact.form.timing.morning': 'Mañana (8AM-12PM)',
    'contact.form.timing.afternoon': 'Tarde (12PM-5PM)',
    'contact.form.timing.evening': 'Noche (5PM-8PM)',
    'contact.form.timing.flexible': 'Horario Flexible',
    'contact.form.message': 'Mensaje',
    'contact.form.submit': 'Enviar Mensaje',
    'contact.form.response': 'Responderemos dentro de 2 horas durante el horario comercial.',
    'contact.hours.monday': 'Lunes - Viernes',
    'contact.hours.saturday': 'Sábado',
    'contact.hours.sunday': 'Domingo',
    'contact.hours.appointment': 'Solo con cita previa',
    'contact.hours.appointment_only': 'Solo con Cita Previa',
    'contact.emergency.title': 'Servicios Profesionales',
    'contact.emergency.description': 'Servicios notariales licenciados, con garantía y asegurados con programación flexible para satisfacer sus necesidades.',
    
    // Footer
    'footer.company': 'Notary & Signings LLC',
    'footer.description': 'Servicios notariales profesionales en los que puedes confiar. Licenciado, con garantía y asegurado para tu tranquilidad. Sirviendo a la comunidad con integridad y excelencia.',
    'footer.quick_links': 'Enlaces Rápidos',
    'footer.services': 'Nuestros Servicios',
    'footer.credentials': 'Credenciales Profesionales',
    'footer.licensed': 'Notario Licenciado',
    'footer.licensed_desc': 'Certificado por el Estado',
    'footer.bonded': 'Con Garantía y Asegurado',
    'footer.bonded_desc': 'Cobertura de $100K',
    'footer.ron_certified': 'Certificado RON',
    'footer.ron_desc': 'Notarización Remota',
    'footer.professional_services': 'Servicios Profesionales',
    'footer.professional_desc': 'Servicios notariales licenciados, con garantía y asegurados con programación flexible.',
    'footer.schedule': 'Programar Cita',
    'footer.copyright': '© 2024 Notary and Signings LLC. Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.cookies': 'Política de Cookies',
  }
};