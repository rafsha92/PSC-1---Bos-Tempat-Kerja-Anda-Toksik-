import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowRight, CalendarBlank, Clock, MapPin, WhatsappLogo, X } from '@phosphor-icons/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const questions = [
  { title: 'Sukar bersuara?', copy: 'Idea, kebimbangan dan pandangan penting terus dipendam.' },
  { title: 'Komunikasi tidak jelas?', copy: 'Arahan berubah, keutamaan kabur dan jangkaan tidak benar-benar jelas.' },
  { title: 'Ketegangan berulang?', copy: 'Isu yang sama muncul semula walaupun semuanya kelihatan sudah selesai.' },
];

const steps = [
  { number: '01', title: 'Perhatikan', copy: 'Kenal pasti corak yang berulang dalam komunikasi dan suasana pasukan.' },
  { number: '02', title: 'Semak', copy: 'Gunakan soalan yang tepat untuk membezakan andaian daripada perkara yang berlaku.' },
  { number: '03', title: 'Renungkan', copy: 'Tentukan perkara yang perlu diberi perhatian dan dibincangkan dengan lebih jelas.' },
];

const audiences = [
  { title: 'Pemilik bisnes', copy: 'Anda mahu mengesan isu budaya kerja sebelum ia mengganggu kejelasan dan kerjasama pasukan.' },
  { title: 'Pengurus dan ketua pasukan', copy: 'Anda perlu memberi arahan dengan lebih jelas dan membuka ruang untuk pasukan bersuara.' },
  { title: 'HR dan pemimpin organisasi', copy: 'Anda mahu menilai corak komunikasi melalui pemerhatian dan soalan yang lebih tersusun.' },
  { title: 'Profesional', copy: 'Anda mahu memahami apa yang sedang berlaku sebelum memilih cara untuk bersuara.' },
];

const faqs = [
  { question: 'Apa yang akan saya pelajari?', answer: 'Anda akan melihat cara mengenal pasti petunjuk komunikasi yang tidak sihat, menyemak corak yang berulang dan menentukan perkara yang wajar diberi perhatian.' },
  { question: 'Adakah seminar ini hanya untuk bos?', answer: 'Tidak. Seminar ini juga sesuai untuk pengurus, ketua pasukan, profesional HR dan individu yang mahu memahami suasana kerja dengan lebih terarah.' },
  { question: 'Bagaimana seminar dijalankan?', answer: 'Seminar berlangsung secara online melalui Zoom Meeting, jadi anda boleh mengikutinya dari lokasi anda.' },
  { question: 'Bila seminar berlangsung dan berapa yurannya?', answer: 'Seminar berlangsung pada 26 September 2026, dari 9.00 pagi hingga 12.00 tengah hari. Yuran penyertaan ialah RM49.00.' },
  { question: 'Bagaimana cara mendaftar?', answer: 'Tekan mana-mana butang pendaftaran, kemudian lengkapkan maklumat peserta dan pembayaran melalui borang OnPay.' },
];

function SeoStructuredData({ siteUrl = '' }) {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const pageUrl = baseUrl ? `${baseUrl}/` : '/';
  const imageUrl = baseUrl ? `${baseUrl}/og.jpg` : '/og.jpg';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        '@id': `${pageUrl}#event`,
        name: 'Bos, Adakah Tempat Kerja Anda Toksik?',
        description: 'Seminar tempat kerja toksik secara online bersama Che Qiim untuk mengenal pasti corak komunikasi yang tidak sihat dan menyemak suasana kerja dengan lebih terarah.',
        startDate: '2026-09-26T09:00:00+08:00',
        endDate: '2026-09-26T12:00:00+08:00',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        image: [imageUrl],
        location: { '@type': 'VirtualLocation', url: pageUrl },
        performer: { '@type': 'Person', name: 'Che Qiim', jobTitle: 'Subject Matter Expert (SME)' },
        organizer: { '@type': 'Organization', name: 'NLP Malaysia' },
        offers: {
          '@type': 'Offer',
          url: 'https://nlpmalaysia.onpay.my/order/form/45',
          price: '49.00',
          priceCurrency: 'MYR',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Seminar Tempat Kerja Toksik Malaysia 2026 | Che Qiim',
        inLanguage: 'ms-MY',
        mainEntity: { '@id': `${pageUrl}#event` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function AngularButton({ href = '#daftar', children, ghost = false, onClick }) {
  const className = `angular-button ${ghost ? 'angular-button--ghost' : ''}`;
  const content = <><span>{children}</span><ArrowRight weight="bold" aria-hidden="true" /></>;

  if (onClick) {
    return <button className={className} type="button" onClick={onClick}>{content}</button>;
  }

  return <a className={className} href={href}>{content}</a>;
}

function Noise() {
  return <div className="noise" aria-hidden="true" />;
}

function RegistrationModal({ open, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [embedState, setEmbedState] = useState('loading');

  useEffect(() => {
    if (!open) return undefined;

    document.body.classList.add('modal-open');
    const page = document.querySelector('.site-shell');
    const previouslyFocused = document.activeElement;
    page?.setAttribute('inert', '');
    setEmbedState('loading');

    const existing = document.querySelector('script[data-onpay-embed]');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://cdn.onpay.my/assets/js/embed-order-form.7e12f83a.min.js';
    script.async = true;
    script.dataset.onpayEmbed = 'true';
    script.onerror = () => setEmbedState('error');
    document.body.appendChild(script);

    const host = document.getElementById('onpay-order-form');
    const observer = new MutationObserver(() => {
      const frame = host?.querySelector('iframe');
      if (!frame) return;
      frame.addEventListener('load', () => setEmbedState('ready'), { once: true });
      observer.disconnect();
    });
    if (host) observer.observe(host, { childList: true, subtree: true });

    const loadingTimeout = window.setTimeout(() => {
      setEmbedState((current) => current === 'loading' ? 'error' : current);
    }, 12000);
    const focusTimeout = window.setTimeout(() => closeButtonRef.current?.focus(), 80);

    const handleKeyboard = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = [...modalRef.current.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyboard);

    return () => {
      document.body.classList.remove('modal-open');
      page?.removeAttribute('inert');
      observer.disconnect();
      window.clearTimeout(loadingTimeout);
      window.clearTimeout(focusTimeout);
      window.removeEventListener('keydown', handleKeyboard);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  useGSAP(() => {
    if (!open || !modalRef.current) return;
    gsap.fromTo(modalRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo('.registration-sheet', { yPercent: 8, scale: 0.97 }, { yPercent: 0, scale: 1, duration: 0.55, ease: 'power3.out' });
  }, { dependencies: [open], scope: modalRef });

  if (!open) return null;

  return (
    <div className="registration-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="registration-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="registration-sheet">
        <div className="registration-sheet__head">
          <div>
            <p className="eyebrow">Pendaftaran peserta</p>
            <h2 id="registration-title">Lengkapkan pendaftaran anda.</h2>
          </div>
          <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="Tutup borang pendaftaran"><X weight="bold" /></button>
        </div>
        <div className="onpay-shell">
          {embedState === 'loading' && <div className="onpay-state" role="status"><span className="loading-line" /><strong>Menyediakan borang pendaftaran…</strong><small>Sambungan ke borang OnPay sedang dimuatkan.</small></div>}
          {embedState === 'error' && <div className="onpay-state onpay-state--error" role="alert"><strong>Borang mengambil masa lebih lama daripada biasa.</strong><small>Gunakan pautan pendaftaran terus di bawah.</small></div>}
          <div id="onpay-order-form" data-url="https://nlpmalaysia.onpay.my/order/form/45" data-only_form="1" />
          <p className={`form-fallback ${embedState === 'ready' ? 'is-ready' : ''}`}>Jika borang tidak muncul, <a href="https://nlpmalaysia.onpay.my/order/form/45" target="_blank" rel="noreferrer">buka halaman pendaftaran OnPay</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default function App({ siteUrl = '' }) {
  const pageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const openRegistration = (event) => {
    event?.preventDefault();
    setRegistrationOpen(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.brand', { y: -18, autoAlpha: 0, duration: 0.65 })
      .from('.hero-copy > *', { y: 40, autoAlpha: 0, stagger: 0.09, duration: 0.85 }, '-=0.45')
      .from('.hero-portrait', { xPercent: 12, autoAlpha: 0, scale: 0.94, duration: 1.1 }, '-=0.85');

    gsap.to('.hero-portrait', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });

    gsap.utils.toArray('.chapter-head, .reveal-block').forEach((element) => {
      gsap.from(element, {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 84%', once: true },
      });
    });

    gsap.utils.toArray('.image-scale').forEach((image) => {
      gsap.fromTo(image,
        { scale: 0.82, autoAlpha: 0.35 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: image, start: 'top 92%', end: 'center 52%', scrub: 1 },
        },
      );
    });

    const issueRows = gsap.utils.toArray('.question-row');
    issueRows.forEach((row, index) => {
      gsap.from(row, {
        x: 90,
        autoAlpha: 0,
        duration: 0.9,
        delay: index * 0.05,
        scrollTrigger: { trigger: row, start: 'top 88%', once: true },
      });
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 900px)', () => {
      ScrollTrigger.create({
        trigger: '.approach-layout',
        start: 'top 16%',
        end: 'bottom 82%',
        pin: '.approach-visual',
        pinSpacing: false,
      });
    });

    const cards = gsap.utils.toArray('.step-card');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { y: index ? 120 : 30, rotate: index % 2 ? 1.5 : -1 },
        {
          y: 0,
          rotate: 0,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 58%', scrub: 0.8 },
        },
      );
    });

    const words = gsap.utils.toArray('.scrub-copy span');
    gsap.fromTo(words,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: '.scrub-copy', start: 'top 82%', end: 'bottom 45%', scrub: 1 },
      },
    );

    gsap.fromTo('.event-rule__fill', { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.event-details', start: 'top 85%', end: 'center 50%', scrub: 1 },
    });

    return () => media.revert();
  }, { scope: pageRef });

  return (
    <>
      <SeoStructuredData siteUrl={siteUrl} />
      <a className="skip-link" href="#main-content">Langkau ke kandungan utama</a>
      <main ref={pageRef} className="site-shell" id="main-content">
        <Noise />
        <nav className="site-nav" aria-label="Navigasi utama">
          <a className="brand" href="#utama" aria-label="Ke bahagian utama">
            <span className="brand-mark" aria-hidden="true" />
            <span>Seminar Eksklusif</span>
          </a>
          <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}>
            <i /><i />
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="primary-navigation">
            <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang</a>
            <a href="#penceramah" onClick={() => setMenuOpen(false)}>Penceramah</a>
            <a href="#butiran" onClick={() => setMenuOpen(false)}>Butiran</a>
            <button className="nav-cta" type="button" onClick={openRegistration}>Daftar sekarang</button>
          </div>
        </nav>

        <section className="hero" id="utama">
          <div className="hero-grid" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">Seminar eksklusif untuk pemimpin</p>
            <h1>Bos, adakah tempat kerja anda toksik?</h1>
            <p className="hero-lead">Kenal pasti corak komunikasi yang tidak sihat dan pelajari cara menyemak suasana kerja dengan lebih terarah.</p>
            <div className="hero-actions">
              <AngularButton onClick={openRegistration}>Sertai seminar — RM49.00</AngularButton>
              <a className="text-link" href="#tentang">Lihat apa yang akan dipelajari <ArrowDown weight="bold" /></a>
            </div>
            <div className="hero-meta">
              <span><CalendarBlank weight="duotone" />26 September 2026</span>
              <span><Clock weight="duotone" />9.00 pagi – 12.00 tengah hari</span>
              <span><MapPin weight="duotone" />Zoom Meeting</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Che Qiim, Subject Matter Expert">
            <div className="hero-halo" />
            <img className="hero-portrait" src="/che-qiim.webp" srcSet="/che-qiim-480.webp 480w, /che-qiim-768.webp 768w, /che-qiim.webp 1086w" sizes="(max-width: 800px) 94vw, 42vw" alt="Che Qiim memakai sut hitam dan merah" width="1086" height="1448" fetchPriority="high" decoding="async" />
            <div className="portrait-caption">
              <strong>Che Qiim</strong>
              <span>Subject Matter Expert (SME)</span>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">26.09</div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Perhatikan</span><i /> <span>Semak</span><i /> <span>Renungkan</span><i />
            <span>Perhatikan</span><i /> <span>Semak</span><i /> <span>Renungkan</span><i />
          </div>
        </div>

        <section className="issues section-pad" id="tentang">
          <div className="section-inner issues-grid">
            <div className="issues-intro chapter-head">
              <p className="eyebrow">Kenali suasana kerja anda</p>
              <h2>Nampak biasa. Tapi ada yang tak kena?</h2>
              <p>Mesyuarat makin senyap. Arahan berubah, idea dipendam dan ketegangan yang sama berulang. Seminar tempat kerja toksik ini membantu anda melihat corak tersebut dengan soalan yang lebih terarah, tanpa terus membuat kesimpulan.</p>
              <div className="office-window image-scale" role="img" aria-label="Bilik mesyuarat pejabat dalam pencahayaan merah">
                <div className="office-window__image" />
                <span>Apa yang tidak dibincangkan tetap dirasai.</span>
              </div>
            </div>
            <div className="questions">
              <div className="question-mark" aria-hidden="true">?</div>
              {questions.map((question, index) => (
                <article className="question-row" key={question.title}>
                  <span className="question-row__index" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{question.title}</h3>
                    <p>{question.copy}</p>
                  </div>
                  <ArrowRight weight="bold" aria-hidden="true" />
                </article>
              ))}
              <a className="text-link questions-link" href="#pendekatan">Kenali pendekatan seminar <ArrowDown weight="bold" /></a>
            </div>
          </div>
        </section>

        <section className="approach section-pad" id="pendekatan">
          <div className="section-inner">
            <header className="chapter-head approach-head">
              <p className="eyebrow">Pendekatan seminar</p>
              <h2>Semak dengan <span className="inline-image" aria-hidden="true" /> tools khas.</h2>
              <p>Kenal pasti corak, semak andaian dan tentukan perkara yang patut diberi perhatian.</p>
            </header>
            <div className="approach-layout">
              <div className="approach-visual image-scale">
                <div className="clipboard-crop" role="img" aria-label="Lembaran semakan dan pen merah di atas papan klip" />
                <div className="approach-visual__label"><span>Ilustrasi konsep</span><b>Semakan tempat kerja</b></div>
              </div>
              <div className="steps-stack">
                {steps.map((step) => (
                  <article className="step-card" key={step.number}>
                    <span className="step-number" aria-hidden="true">{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.copy}</p>
                    </div>
                    <span className="step-arrow"><ArrowRight weight="bold" /></span>
                  </article>
                ))}
                <AngularButton ghost href="#butiran">Lihat butiran seminar</AngularButton>
              </div>
            </div>
          </div>
        </section>

        <section className="audience section-pad" id="sesuai-untuk">
          <div className="section-inner audience-layout">
            <header className="chapter-head audience-intro">
              <p className="eyebrow">Sesuai untuk siapa</p>
              <h2>Adakah ini situasi anda?</h2>
              <p>Seminar ini sesuai jika anda memimpin pasukan, mengurus komunikasi atau cuba memahami mengapa isu yang sama terus berulang.</p>
              <a className="text-link" href="#penceramah">Kenali penceramah <ArrowDown weight="bold" /></a>
            </header>
            <div className="audience-list reveal-block">
              {audiences.map((audience, index) => (
                <article className="audience-row" key={audience.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div><h3>{audience.title}</h3><p>{audience.copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="speaker section-pad" id="penceramah">
          <div className="speaker-glow" />
          <div className="section-inner speaker-grid">
            <div className="speaker-copy chapter-head">
              <p className="eyebrow">Kenali penceramah</p>
              <h2>Che Qiim</h2>
              <p className="speaker-role">Subject Matter Expert (SME)</p>
              <p className="speaker-bio">Dalam seminar ini, Che Qiim membimbing peserta untuk memerhati, menyemak dan merenung agar corak yang sering dianggap biasa dapat dilihat dengan lebih jelas.</p>
              <div className="red-rule" />
              <p className="scrub-copy">
                {'Jangan terus meneka. Belajar melihat corak sebelum memilih tindakan.'.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word} </span>)}
              </p>
              <AngularButton ghost onClick={openRegistration}>Sertai sesi bersama Che Qiim</AngularButton>
            </div>
            <div className="speaker-visual reveal-block">
              <span className="speaker-outline" aria-hidden="true">CQ</span>
              <img src="/che-qiim.webp" srcSet="/che-qiim-480.webp 480w, /che-qiim-768.webp 768w, /che-qiim.webp 1086w" sizes="(max-width: 800px) 92vw, 38vw" alt="Che Qiim, penceramah seminar" width="1086" height="1448" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        <section className="event-details section-pad" id="butiran">
          <div className="section-inner">
            <header className="chapter-head event-head">
              <p className="eyebrow">Butiran seminar</p>
              <h2>Catat tarikh ini.</h2>
            </header>
            <div className="event-rule"><span className="event-rule__fill" /></div>
            <div className="event-grid reveal-block">
              <article className="event-item event-date">
                <CalendarBlank weight="thin" aria-hidden="true" />
                <div><strong>26</strong><span>September 2026</span></div>
              </article>
              <article className="event-item">
                <Clock weight="thin" aria-hidden="true" />
                <div><small>Masa</small><strong>9.00 pagi –<br />12.00 tengah hari</strong></div>
              </article>
              <article className="event-item">
                <MapPin weight="thin" aria-hidden="true" />
                <div><small>Platform online</small><strong>Zoom Meeting</strong><span>Ikuti dari lokasi anda.</span></div>
              </article>
            </div>
          </div>
        </section>

        <section className="faq section-pad" id="soalan-lazim">
          <div className="section-inner">
            <header className="chapter-head faq-head">
              <p className="eyebrow">Soalan lazim</p>
              <h2>Sebelum anda sertai.</h2>
              <p>Jawapan ringkas tentang kandungan seminar, siapa yang sesuai menyertai dan cara mendaftar.</p>
            </header>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <article className="faq-item reveal-block" key={faq.question}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div><h3>{faq.question}</h3><p>{faq.answer}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="registration section-pad" id="daftar">
          <div className="registration-flare" />
          <div className="section-inner registration-inner reveal-block">
            <p className="eyebrow">Seminar eksklusif</p>
            <h2>Lihat apa yang selama ini terlepas pandang.</h2>
            <p className="price-label">Yuran program</p>
            <div className="price"><small>RM</small><strong>49.00</strong></div>
            <AngularButton onClick={openRegistration}>Sahkan penyertaan saya</AngularButton>
            <p className="registration-note">Pendaftaran melalui OnPay. Seminar dijalankan secara online melalui Zoom Meeting.</p>
            <div className="registration-meta">
              <span>26 September 2026</span><i />
              <span>9.00 pagi – 12.00 tengah hari</span><i />
              <span>Zoom Meeting</span>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <p>Bos, Adakah Tempat Kerja Anda Toksik?</p>
          <a href="#utama">Kembali ke atas <ArrowRight weight="bold" /></a>
          <p>Bersama Che Qiim · Pendaftaran melalui OnPay</p>
        </footer>
        <a
          className="whatsapp-admin"
          href="https://wa.me/60133271355?text=Salam%2C%20saya%20ingin%20bertanya%20tentang%20seminar%20Bos%2C%20Adakah%20Tempat%20Kerja%20Anda%20Toksik%3F"
          target="_blank"
          rel="noreferrer"
          aria-label="Tanya admin melalui WhatsApp di 013-327 1355"
        >
          <WhatsappLogo weight="fill" aria-hidden="true" />
          <span>Tanya admin</span>
        </a>
      </main>
      <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
    </>
  );
}
