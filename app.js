/**
 * Main Application Engine — Welcome to 9B Experience (Vertical Scroll Edition)
 * Minimalist, Modern, High-Performance, Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    knowledgeScore: 20,
    currentChapter: 1,
    totalChapters: 7,
    soundEnabled: false,
    quizIndex: 0,
    quizScore: 0,
    controllerIndex: 0,
    ethicsChecks: JSON.parse(localStorage.getItem('class9b_ethics_checks') || '[false, false, false, false, false]'),
    activeFactIndex: 0
  };

  // DOM references
  const scrollStream = document.getElementById('vertical-scroll-stream');
  const scrollProgressLine = document.getElementById('scroll-progress-line');
  const hudChapterPill = document.getElementById('hud-chapter-pill');
  const hudIqVal = document.getElementById('hud-iq-val');
  const btnHudIq = document.getElementById('btn-hud-iq');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const btnBackToTop = document.getElementById('btn-back-to-top');
  const hudBrandHome = document.getElementById('hud-brand-home');

  // Opening elements
  const openingOverlay = document.getElementById('opening-overlay');
  const openingProgressBar = document.getElementById('opening-progress-bar');
  const openingPercentText = document.getElementById('opening-percent-text');
  const btnStartStream = document.getElementById('btn-start-stream');

  // Modals
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  const quickfactModal = document.getElementById('quickfact-modal');
  const btnQuickFact = document.getElementById('btn-quick-fact');
  const btnCloseQuickfact = document.getElementById('btn-close-quickfact');
  const btnNextFact = document.getElementById('btn-next-fact');
  const factHeadline = document.getElementById('fact-headline');
  const factBodyText = document.getElementById('fact-body-text');

  const completionModal = document.getElementById('completion-modal');
  const btnOpenCompletion = document.getElementById('btn-open-completion');
  const btnCloseCompletion = document.getElementById('btn-close-completion');
  const btnBackToStart = document.getElementById('btn-back-to-start');
  const finalIqVal = document.getElementById('final-iq-val');

  // ========================================================================
  // 1. INITIALIZE 3D ROTATING CYBER CORE (SCROLL-DRIVEN)
  // ========================================================================
  if (window.CyberCore3D) {
    new window.CyberCore3D('cyber-core-canvas', 'vertical-scroll-stream');
  }

  // ========================================================================
  // 2. OPENING PROGRESS LOADER SEQUENCE
  // ========================================================================
  let loadProgress = 0;
  const loadTimer = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 8) + 6;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadTimer);
      openingProgressBar.style.width = '100%';
      openingPercentText.textContent = '100%';
      setTimeout(() => {
        btnStartStream.style.display = 'inline-flex';
      }, 250);
    } else {
      openingProgressBar.style.width = `${loadProgress}%`;
      openingPercentText.textContent = `${loadProgress}%`;
    }
  }, 80);

  btnStartStream.addEventListener('click', () => {
    window.cyberAudio.playWarp();
    openingOverlay.classList.remove('active');
    addKnowledge(10);
  });

  // ========================================================================
  // 3. VERTICAL SCROLL PROGRESS, 3D SPEED & DYNAMIC CHAPTER INDICATOR
  // ========================================================================
  function updateScrollMetrics() {
    const st = scrollStream.scrollTop;
    const maxScroll = scrollStream.scrollHeight - scrollStream.clientHeight;
    const scrollRatio = maxScroll > 0 ? st / maxScroll : 0;

    // Top progress bar
    scrollProgressLine.style.width = `${Math.min(100, Math.max(0, scrollRatio * 100))}%`;

    // Back to top visibility
    if (st > 180) {
      btnBackToTop.classList.add('visible');
    } else {
      btnBackToTop.classList.remove('visible');
    }

    // Dynamic IQ progress based on scroll depth
    const scrollBonus = Math.floor(scrollRatio * 60);
    const targetIq = Math.min(100, 20 + scrollBonus);
    if (targetIq > state.knowledgeScore) {
      addKnowledge(targetIq - state.knowledgeScore);
    }
  }

  scrollStream.addEventListener('scroll', updateScrollMetrics, { passive: true });

  // IntersectionObserver for active chapter HUD & Scroll Reveal
  const chapterSections = document.querySelectorAll('.chapter-section');
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        const ch = parseInt(entry.target.getAttribute('data-chapter'));
        if (ch && ch !== state.currentChapter) {
          state.currentChapter = ch;
          hudChapterPill.textContent = `0${ch} / 0${state.totalChapters}`;
        }
      }
    });
  }, {
    root: scrollStream,
    threshold: 0.25
  });

  chapterSections.forEach(sec => chapterObserver.observe(sec));

  // Card reveal observer
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    root: scrollStream,
    threshold: 0.15
  });

  document.querySelectorAll('.clean-card').forEach(c => {
    c.classList.add('scroll-reveal');
    cardObserver.observe(c);
  });

  // Navigation Click Actions
  btnBackToTop.addEventListener('click', () => {
    window.cyberAudio.playClick();
    scrollStream.scrollTo({ top: 0, behavior: 'smooth' });
  });

  hudBrandHome.addEventListener('click', () => {
    window.cyberAudio.playClick();
    scrollStream.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Sound FX Toggle
  btnToggleSound.addEventListener('click', () => {
    const isNowOn = window.cyberAudio.toggleSound();
    state.soundEnabled = isNowOn;
    if (isNowOn) {
      iconSoundOff.style.display = 'none';
      iconSoundOn.style.display = 'block';
      btnToggleSound.classList.add('active');
    } else {
      iconSoundOff.style.display = 'block';
      iconSoundOn.style.display = 'none';
      btnToggleSound.classList.remove('active');
    }
  });

  function addKnowledge(points) {
    state.knowledgeScore = Math.min(100, state.knowledgeScore + points);
    hudIqVal.textContent = `${state.knowledgeScore}%`;
    if (finalIqVal) finalIqVal.textContent = `${state.knowledgeScore}% (EXCELLENT)`;
  }

  btnHudIq.addEventListener('click', () => {
    window.cyberAudio.playClick();
    completionModal.classList.add('active');
  });

  // ========================================================================
  // 4. CHAPTER 02: FLOW DIAGRAM, TIMELINE & MINI GAME
  // ========================================================================
  const flowDescriptions = {
    1: {
      title: 'TAHAP 01: INPUT (DATA & SENSOR)',
      desc: 'AI menyerap data mentah (teks pertanyaan, jutaan data artikel, suara pengguna, citra foto). Tanpa data berkualitas dari manusia, sistem AI tidak dapat belajar apapun.'
    },
    2: {
      title: 'TAHAP 02: PROSES (NEURAL NETWORK)',
      desc: 'Algoritma machine learning memecah data ke dalam matriks matematika dan mengalkulasi bobot probabilitas untuk menemukan korelasi pola informasi tersembunyi.'
    },
    3: {
      title: 'TAHAP 03: OUTPUT (PREDIKSI & KREASI)',
      desc: 'Hasil akhir dikeluarkan dalam bentuk prediksi probabilitas: jawaban esai siswa, rekomendasi video, terjemahan bahasa, atau deteksi dini anomali medis.'
    }
  };

  document.querySelectorAll('.flow-step-box').forEach((box) => {
    box.addEventListener('click', () => {
      window.cyberAudio.playClick();
      document.querySelectorAll('.flow-step-box').forEach(b => b.classList.remove('active'));
      box.classList.add('active');

      const fId = box.getAttribute('data-flow');
      const item = flowDescriptions[fId];
      const drawer = document.getElementById('flow-detail-drawer');
      drawer.innerHTML = `
        <strong style="color:var(--cyan-neon);">${item.title}</strong>
        <p style="margin-top:3px;">${item.desc}</p>
      `;
      addKnowledge(3);
    });
  });

  // Timeline Sejarah
  const timelineMilestones = {
    1950: {
      title: '1950 — Alan Turing merumuskan Turing Test',
      desc: 'Makalah legendaris "Computing Machinery and Intelligence" menguji apakah mesin dapat menunjukkan perilaku cerdas yang tak dapat dibedakan dari manusia.'
    },
    1956: {
      title: '1956 — Kelahiran Istilah "Artificial Intelligence"',
      desc: 'John McCarthy dkk. secara resmi memperkenalkan istilah Artificial Intelligence di Konferensi Dartmouth, menandai awal disiplin ilmu baru.'
    },
    1997: {
      title: '1997 — Deep Blue Mengalahkan Juara Catur Dunia',
      desc: 'Komputer catur IBM Deep Blue mengalahkan grandmaster Garry Kasparov, membuktikan mesin mampu melampaui strategi taktik logika manusia.'
    },
    2012: {
      title: '2012 — Revolusi Deep Learning (AlexNet)',
      desc: 'AlexNet memenangkan kompetisi ImageNet dengan akurasi pengenalan gambar fantastis, memicu era ledakan GPU dan Big Data modern.'
    },
    2022: {
      title: '2022 — Ledakan Generative AI (Era ChatGPT)',
      desc: 'Model bahasa besar (LLM) meledak ke publik, memungkinkan percakapan alami, kreasi seni instan, dan revolusi cara belajar di sekolah.'
    },
    2026: {
      title: '2026+ — Era Autonomous AI Agents & Multimodal',
      desc: 'AI berevolusi menjadi agen mandiri yang mengintegrasikan teks, audio, dan sensor fisik secara langsung untuk mendampingi manusia.'
    }
  };

  document.querySelectorAll('.timeline-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      window.cyberAudio.playClick();
      document.querySelectorAll('.timeline-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const y = chip.getAttribute('data-year');
      const data = timelineMilestones[y];
      document.getElementById('timeline-title-text').textContent = data.title;
      document.getElementById('timeline-desc-text').textContent = data.desc;
      addKnowledge(3);
    });
  });

  // Mini Game: AI OR HUMAN?
  const quizPool = [
    {
      q: '1. Menganalisis 5.000 foto rontgen paru-paru dalam 10 detik untuk menemukan pola tumor?',
      ans: 'AI',
      exp: 'Tepat! AI unggul dalam kecepatan memindai pola visual dan data berskala raksasa.'
    },
    {
      q: '2. Merasakan kesedihan tulus dan menghibur sahabat sekelas yang sedang berduka?',
      ans: 'HUMAN',
      exp: 'Benar! Empati, rasa sayang, dan ketulusan batiniah mutlak hanya dimiliki manusia.'
    },
    {
      q: '3. Menghitung rute navigasi tercepat dari jutaan data sinyal GPS secara real-time?',
      ans: 'AI',
      exp: 'Tepat! Sistem AI mengolah algoritma big data lalu lintas tanpa kelelahan.'
    },
    {
      q: '4. Menulis puisi orisinal yang lahir dari getaran rasa patah hati dan pengalaman hidup?',
      ans: 'HUMAN',
      exp: 'Benar! AI hanya merangkai probabilitas kata, namun jiwa dan rasa murni dari manusia.'
    },
    {
      q: '5. Mengambil keputusan moral yang adil saat terjadi dilema kemanusiaan rumit?',
      ans: 'HUMAN',
      exp: 'Benar! Kebijaksanaan, nurani, dan pertimbangan moral membutuhkan akal budi manusia.'
    }
  ];

  const quizPromptText = document.getElementById('quiz-prompt-text');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizScoreVal = document.getElementById('quiz-score-val');

  document.querySelectorAll('.btn-quiz-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-ans');
      const current = quizPool[state.quizIndex];

      if (choice === current.ans) {
        window.cyberAudio.playSuccess();
        state.quizScore++;
        quizFeedbackBox.style.display = 'block';
        quizFeedbackBox.style.background = 'rgba(16, 185, 129, 0.2)';
        quizFeedbackBox.style.border = '1px solid #10b981';
        quizFeedbackBox.style.color = '#6ee7b7';
        quizFeedbackBox.innerHTML = `<strong>Tepat!</strong> ${current.exp}`;
        addKnowledge(4);
      } else {
        window.cyberAudio.playWarning();
        quizFeedbackBox.style.display = 'block';
        quizFeedbackBox.style.background = 'rgba(255, 51, 102, 0.2)';
        quizFeedbackBox.style.border = '1px solid #ff3366';
        quizFeedbackBox.style.color = '#fda4af';
        quizFeedbackBox.innerHTML = `<strong>Kurang Tepat.</strong> Jawabannya adalah <strong>${current.ans}</strong>. ${current.exp}`;
      }

      quizScoreVal.textContent = `SKOR: ${state.quizScore}/${quizPool.length}`;

      setTimeout(() => {
        state.quizIndex = (state.quizIndex + 1) % quizPool.length;
        quizPromptText.textContent = quizPool[state.quizIndex].q;
        quizFeedbackBox.style.display = 'none';
      }, 2200);
    });
  });

  // ========================================================================
  // 5. CHAPTER 03: 4 SECTOR FIELDS
  // ========================================================================
  const sectorsData = {
    edu: {
      title: 'Pendidikan & Pembelajaran Adaptif',
      badge: 'ADAPTIVE',
      desc: 'AI menyesuaikan tempo belajar siswa: mengidentifikasi materi rumus yang belum dikuasai dan menyajikan latihan yang dirancang khusus tanpa menghakimi.',
      example: 'Platform bimbingan belajar cerdas yang memetakan gaya belajar setiap siswa secara presisi.',
      impact: 'Belajar mandiri menjadi lebih efektif, terarah, dan fleksibel 24/7.'
    },
    health: {
      title: 'Kesehatan & Diagnosa Medis',
      badge: 'HEALTHCARE',
      desc: 'Pendeteksian dini penyakit langka, asisten bedah robotik presisi tinggi, dan perancangan molekul obat baru dalam hitungan bulan.',
      example: 'Sistem AlphaFold Google DeepMind yang memprediksi 200 juta struktur protein untuk riset kedokteran dunia.',
      impact: 'Membantu dokter menyelamatkan lebih banyak nyawa dengan pencegahan sedini mungkin.'
    },
    industry: {
      title: 'Industri Cerdas & Ekonomi',
      badge: 'INDUSTRY',
      desc: 'Otomatisasi pabrik, pemeliharaan prediktif mesin sebelum rusak, dan logistik cerdas yang menghemat energi dan meminimalisir limbah.',
      example: 'Robot gudang logistik otomatis yang memilah puluhan ribu paket per jam tanpa galat.',
      impact: 'Mendorong efisiensi global, namun mewajibkan generasi muda menguasai keahlian baru.'
    },
    creative: {
      title: 'Kreativitas & Keseharian',
      badge: 'CREATIVE',
      desc: 'Asisten pembuatan sketsa visual, aransemen audio, penerjemah instan bahasa dunia, hingga sistem navigasi pintar harian kita.',
      example: 'Desainer grafis memanfaatkan generative AI untuk menguji ratusan konsep moodboard dalam hitungan menit.',
      impact: 'Mempercepat realisasi ide kreatif siswa 9B dari imajinasi menjadi karya nyata.'
    }
  };

  document.querySelectorAll('.sector-tab-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      window.cyberAudio.playClick();
      document.querySelectorAll('.sector-tab-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const sKey = pill.getAttribute('data-sec');
      const item = sectorsData[sKey];

      document.getElementById('sector-title').textContent = item.title;
      document.getElementById('sector-badge').textContent = item.badge;
      document.getElementById('sector-desc').textContent = item.desc;
      document.getElementById('sector-example').textContent = item.example;
      document.getElementById('sector-impact').textContent = item.impact;
      addKnowledge(3);
    });
  });

  // ========================================================================
  // 6. CHAPTER 04: THE DARK SIDE SIMULATION & COLLAPSIBLE THREATS
  // ========================================================================
  const riskGaugeFill = document.getElementById('risk-gauge-fill');
  const riskStatusTag = document.getElementById('risk-status-tag');
  const dilemmaResultPanel = document.getElementById('dilemma-result-panel');

  const dilemmaResponses = {
    share: {
      risk: 85,
      status: 'BAHAYA (TINGGI)',
      color: '#ff3366',
      text: '⚠️ <strong>Pilihan Berbahaya!</strong> Menyebarkan konten rekayasa deepfake melanggar privasi, melukai martabat teman, dan terancam sanksi pidana UU ITE.'
    },
    report: {
      risk: 15,
      status: 'AMAN (TERPUJI)',
      color: '#34d399',
      text: '✅ <strong>Keputusan Sangat Bijak!</strong> Kamu melindungi teman sekelas, memutus rantai cyberbullying, dan menegakkan adab digital.'
    },
    silent: {
      risk: 50,
      status: 'WASPADA (SEDANG)',
      color: '#facc15',
      text: 'ℹ️ <strong>Sikap Pasif:</strong> Mendiamkan kejahatan siber membuat penyebarnya merasa benar. Beranilah mengingatkan dengan sopan demi keamanan bersama.'
    }
  };

  document.querySelectorAll('.dilemma-choice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-choice');
      const res = dilemmaResponses[c];

      if (c === 'report') {
        window.cyberAudio.playSuccess();
        dilemmaResultPanel.style.background = 'rgba(16, 185, 129, 0.2)';
        dilemmaResultPanel.style.border = '1px solid #10b981';
      } else {
        window.cyberAudio.playWarning();
        dilemmaResultPanel.style.background = 'rgba(255, 51, 102, 0.2)';
        dilemmaResultPanel.style.border = '1px solid #ff3366';
      }

      riskGaugeFill.style.width = `${res.risk}%`;
      riskStatusTag.textContent = res.status;
      riskStatusTag.style.color = res.color;
      dilemmaResultPanel.style.display = 'block';
      dilemmaResultPanel.innerHTML = res.text;
      addKnowledge(5);
    });
  });

  // Collapsible Accordion Threats
  document.querySelectorAll('.clean-accordion-head').forEach((head) => {
    head.addEventListener('click', () => {
      window.cyberAudio.playClick();
      const parent = head.parentElement;
      parent.classList.toggle('open');
      const chevron = head.querySelector('.acc-chevron');
      if (chevron) chevron.textContent = parent.classList.contains('open') ? '▲' : '▼';
    });
  });

  // ========================================================================
  // 7. CHAPTER 05: HUMAN-IN-THE-LOOP & PERSISTENT CHECKLIST
  // ========================================================================
  const controllerScenarios = [
    {
      prompt: 'Menolak beasiswa seorang siswa secara otomatis karena riwayat kode pos alamatnya di daerah ekonomi bawah.',
      best: 'tolak',
      feedbackBest: '✅ <strong>Tindakan Tepat!</strong> Ini adalah Algorithmic Bias. Alamat bukan cerminan potensi akademik. Manusia wajib menolak diskriminasi mesin!',
      feedbackOther: '⚠️ <strong>Peringatan!</strong> Menerima saran ini berarti membiarkan ketidakadilan sistemik. Manusia harus mengoreksi bias data.'
    },
    {
      prompt: 'AI medis menyarankan dosis obat keras 98% yakin, namun riwayat alergi obat pasien belum sempat dimasukkan ke sistem.',
      best: 'periksa',
      feedbackBest: '✅ <strong>Keputusan Bijak!</strong> Nyawa manusia menjadi taruhan. Dokter wajib memeriksa riwayat alergi pasien sebelum eksekusi.',
      feedbackOther: '⚠️ <strong>Hati-hati!</strong> Jangan pernah menerima saran medis berisiko tinggi tanpa pemeriksaan riwayat pasien lengkap.'
    },
    {
      prompt: 'AI mendeteksi plagiarisme 70% pada tugas esai siswa, padahal teks yang mirip adalah kutipan resmi naskah UUD 1945.',
      best: 'tolak',
      feedbackBest: '✅ <strong>Keputusan Cerdas!</strong> Mengutip teks undang-undang resmi bukan plagiarisme. Guru manusia wajib melihat konteks teks.',
      feedbackOther: '⚠️ <strong>Perhatikan Konteks!</strong> Mesin hanya mencocokkan kemiripan teks tanpa mengerti konteks dokumen resmi.'
    }
  ];

  const controllerPromptDisplay = document.getElementById('controller-prompt-display');
  const controllerCounterText = document.getElementById('controller-counter-text');
  const controllerFeedbackPanel = document.getElementById('controller-feedback-panel');

  document.querySelectorAll('.btn-decision').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dec = btn.getAttribute('data-dec');
      const cur = controllerScenarios[state.controllerIndex];

      if (dec === cur.best) {
        window.cyberAudio.playSuccess();
        controllerFeedbackPanel.style.display = 'block';
        controllerFeedbackPanel.style.background = 'rgba(16, 185, 129, 0.2)';
        controllerFeedbackPanel.style.border = '1px solid #10b981';
        controllerFeedbackPanel.innerHTML = cur.feedbackBest;
        addKnowledge(5);
      } else {
        window.cyberAudio.playWarning();
        controllerFeedbackPanel.style.display = 'block';
        controllerFeedbackPanel.style.background = 'rgba(255, 51, 102, 0.2)';
        controllerFeedbackPanel.style.border = '1px solid #ff3366';
        controllerFeedbackPanel.innerHTML = cur.feedbackOther;
      }

      setTimeout(() => {
        state.controllerIndex = (state.controllerIndex + 1) % controllerScenarios.length;
        controllerPromptDisplay.textContent = controllerScenarios[state.controllerIndex].prompt;
        controllerCounterText.textContent = `KASUS: ${state.controllerIndex + 1}/3`;
        controllerFeedbackPanel.style.display = 'none';
      }, 3000);
    });
  });

  // Ethics Checklist
  const checklistRows = document.querySelectorAll('.checklist-minimal-row');
  const badgeUnlockedBanner = document.getElementById('badge-unlocked-banner');

  function renderChecklistUI() {
    let allChecked = true;
    checklistRows.forEach((row, idx) => {
      if (state.ethicsChecks[idx]) {
        row.classList.add('checked');
      } else {
        row.classList.remove('checked');
        allChecked = false;
      }
    });

    if (allChecked) {
      badgeUnlockedBanner.style.display = 'block';
    } else {
      badgeUnlockedBanner.style.display = 'none';
    }
  }

  checklistRows.forEach((row, idx) => {
    row.addEventListener('click', () => {
      window.cyberAudio.playClick();
      state.ethicsChecks[idx] = !state.ethicsChecks[idx];
      localStorage.setItem('class9b_ethics_checks', JSON.stringify(state.ethicsChecks));
      renderChecklistUI();

      if (state.ethicsChecks.every(Boolean)) {
        window.cyberAudio.playSuccess();
        addKnowledge(15);
      } else {
        addKnowledge(2);
      }
    });
  });

  renderChecklistUI();

  // ========================================================================
  // 8. CHAPTER 06: BUILD YOUR FUTURE SKILL MATRIX
  // ========================================================================
  const skillChips = document.querySelectorAll('.skill-tag-chip');
  const skillSynergyOutput = document.getElementById('skill-synergy-output');

  const synergyPhrases = {
    kreatif: 'menghasilkan ide-ide orisinal dan sentuhan estetika emosional.',
    empati: 'membangun ikatan batiniah dan saling merawat relasi antarsesama.',
    kritis: 'menganalisis kebenaran informasi tanpa terpedaya halusinasi mesin.',
    problem: 'mengintegrasikan berbagai ilmu memecahkan tantangan dunia nyata.',
    etik: 'menjadi penjaga moral agar kecanggihan teknologi menjunjung kemanusiaan.',
    lead: 'menginspirasi dan mengarahkan potensi tim menuju masa depan gemilang.'
  };

  skillChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      window.cyberAudio.playClick();
      chip.classList.toggle('selected');

      const selected = Array.from(skillChips).filter(c => c.classList.contains('selected'));
      if (selected.length === 0) {
        skillSynergyOutput.textContent = 'Pilih minimal satu keahlian manusia untuk melihat formula sinergimu dengan AI!';
        return;
      }

      const names = selected.map(c => c.textContent.trim().replace(/^[^\w\s]+/, '').trim());
      const keys = selected.map(c => c.getAttribute('data-sk'));
      const descriptions = keys.map(k => synergyPhrases[k]).join(' Selain itu, kamu juga ');

      skillSynergyOutput.innerHTML = `
        Perpaduan <strong>${names.join(' & ')}</strong> menjadikanmu siswa 9B berkarakter unggul yang mampu ${descriptions}. AI adalah akseleratormu, kamulah penentu tujuannya!
      `;
      addKnowledge(4);
    });
  });

  // ========================================================================
  // 9. CHAPTER 07: GALLERY LIGHTBOX & COMPLETION MODAL
  // ========================================================================
  const photoMeta = {
    indoor: {
      src: 'assets/images/class_9b_indoor.jpg',
      title: 'Kebersamaan & Tawa di Lab Komputer 9B',
      desc: 'Potret hangat siswa-siswi Kelas 9B saat belajar bersama di ruang komputer. Semangat kolaboratif, senyuman, dan persahabatan yang abadi.'
    },
    outdoor: {
      src: 'assets/images/class_9b_outdoor.jpg',
      title: 'Apel Kebanggaan SMP YPVDP Bontang',
      desc: 'Momen berharga bersama bapak/ibu guru dan peraih prestasi di halaman sekolah Yayasan Vidatra SMP YPVDP Bontang.'
    }
  };

  document.querySelectorAll('.memories-card').forEach((card) => {
    card.addEventListener('click', () => {
      window.cyberAudio.playClick();
      const pKey = card.getAttribute('data-photo');
      const item = photoMeta[pKey];

      lightboxImg.src = item.src;
      lightboxTitle.textContent = item.title;
      lightboxDesc.textContent = item.desc;
      lightboxModal.classList.add('active');
    });
  });

  btnCloseLightbox.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });

  // Completion modal
  btnOpenCompletion.addEventListener('click', () => {
    window.cyberAudio.playSuccess();
    completionModal.classList.add('active');
  });
  btnCloseCompletion.addEventListener('click', () => completionModal.classList.remove('active'));
  completionModal.addEventListener('click', (e) => {
    if (e.target === completionModal) completionModal.classList.remove('active');
  });

  btnBackToStart.addEventListener('click', () => {
    completionModal.classList.remove('active');
    scrollStream.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========================================================================
  // 10. QUICK FACTS MODAL
  // ========================================================================
  const curatedFacts = [
    {
      title: 'FAKTA AI #1 // HALUSINASI AI',
      body: 'AI generatif bisa mengalami "Halusinasi" — kondisi saat AI mengarang jawaban fiktif dengan percaya diri karena hanya menghitung korelasi probabilitas kata, bukan kebenaran hakiki.'
    },
    {
      title: 'FAKTA AI #2 // EFISIENSI ENERGI HIJAU',
      body: 'Satu proses pembuatan gambar oleh AI membutuhkan konsumsi listrik setara pengisian baterai smartphone! Mengembangkan AI ramah lingkungan adalah misi penting ilmuwan saat ini.'
    },
    {
      title: 'FAKTA AI #3 // SEJARAH CATUR 1997',
      body: 'Komputer catur Deep Blue mampu menganalisis 200 juta kemungkinan langkah per detik untuk mengalahkan juara dunia catur manusia Garry Kasparov.'
    },
    {
      title: 'FAKTA AI #4 // HUMAN-IN-THE-LOOP (HITL)',
      body: 'Prinsip "Human-in-the-Loop" mewajibkan keputusan vital yang menyangkut nasib manusia (seperti vonis hukum dan operasi medis) harus selalu dikendalikan oleh manusia.'
    },
    {
      title: 'FAKTA AI #5 // KURIKULUM AI INDONESIA',
      body: 'Kemendikdasmen merancang mapel koding & AI sebagai pilihan di sekolah Indonesia agar siswa memiliki adab digital (*digital citizenship*) sejak dini.'
    }
  ];

  function showQuickFact(idx) {
    const f = curatedFacts[idx];
    factHeadline.textContent = f.title;
    factBodyText.textContent = f.body;
  }

  btnQuickFact.addEventListener('click', () => {
    window.cyberAudio.playClick();
    showQuickFact(state.activeFactIndex);
    quickfactModal.classList.add('active');
  });

  btnNextFact.addEventListener('click', () => {
    window.cyberAudio.playClick();
    state.activeFactIndex = (state.activeFactIndex + 1) % curatedFacts.length;
    showQuickFact(state.activeFactIndex);
    addKnowledge(2);
  });

  btnCloseQuickfact.addEventListener('click', () => {
    quickfactModal.classList.remove('active');
  });
  quickfactModal.addEventListener('click', (e) => {
    if (e.target === quickfactModal) quickfactModal.classList.remove('active');
  });
});
