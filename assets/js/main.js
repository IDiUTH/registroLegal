/**
* Template Name: SoftLand
* Template URL: https://bootstrapmade.com/softland-bootstrap-app-landing-page-template/
* Updated: Mar 17 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Validación en tiempo real del formulario
   */
  const initFormValidation = () => {
    const form = select('#form');
    if (!form) return;

    const inputs = select('.form-control-modern', true);
    const radioInputs = select('input[type="radio"]', true);
    const selectInputs = select('.select-custom', true);
    const phoneInput = select('#celular');

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const formatPhoneNumber = (value) => {
      // Remover cualquier carácter que no sea número
      const cleaned = value.replace(/\D/g, '');
      
      // Limitar a 8 dígitos para Honduras
      const limited = cleaned.slice(0, 8);
      
      // Formatear como XXXX-XXXX
      if (limited.length <= 4) {
        return limited;
      } else {
        return limited.slice(0, 4) + '-' + limited.slice(4);
      }
    };

    const showError = (element, message) => {
      // Encontrar el contenedor más cercano con class form-group-wrapper
      const wrapper = element.closest('.form-group-wrapper');
      if (wrapper) {
        const errorEl = wrapper.querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = message;
        }
        const iconEl = wrapper.querySelector('.input-validation-icon');
        if (iconEl) {
          iconEl.style.display = 'none';
        }
      }
    };

    const showSuccess = (element) => {
      const wrapper = element.closest('.form-group-wrapper');
      if (wrapper) {
        const errorEl = wrapper.querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = '';
        }
        const iconEl = wrapper.querySelector('.input-validation-icon');
        if (iconEl) {
          iconEl.style.display = 'block';
        }
      }
    };

    const hideValidation = (element) => {
      const wrapper = element.closest('.form-group-wrapper');
      if (wrapper) {
        const errorEl = wrapper.querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = '';
        }
        const iconEl = wrapper.querySelector('.input-validation-icon');
        if (iconEl) {
          iconEl.style.display = 'none';
        }
      }
    };

    // Validación del teléfono con formato automático
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        e.target.value = formatted;
        
        const value = formatted.replace(/\D/g, '');
        if (value.length === 8) {
          showSuccess(phoneInput);
        } else {
          hideValidation(phoneInput);
        }
        updateFormProgress();
      });

      phoneInput.addEventListener('blur', () => {
        const value = phoneInput.value.replace(/\D/g, '');
        if (!value) {
          showError(phoneInput, 'El número de celular es requerido');
        } else if (value.length !== 8) {
          showError(phoneInput, 'El número debe tener 8 dígitos (Honduras)');
        } else {
          showSuccess(phoneInput);
        }
      });
    }

    // Validación de otros inputs
    inputs.forEach(input => {
      if (input.id === 'celular') return; // Ya manejado arriba

      input.addEventListener('blur', () => {
        const value = input.value.trim();

        if (!value) {
          showError(input, 'Este campo es requerido');
          return;
        }

        if (input.type === 'email' && !validateEmail(value)) {
          showError(input, 'Por favor, ingresa un email válido');
        } else if (input.id === 'name' && value.length < 3) {
          showError(input, 'El nombre debe tener al menos 3 caracteres');
        } else if (input.id === 'school' && value.length < 3) {
          showError(input, 'El nombre es muy corto');
        } else {
          showSuccess(input);
        }
      });

      input.addEventListener('input', () => {
        const value = input.value.trim();
        
        // Validar mientras escribe
        if (input.type === 'email') {
          if (value && validateEmail(value)) {
            showSuccess(input);
          } else if (value) {
            hideValidation(input);
          } else {
            hideValidation(input);
          }
        } else if (input.id === 'name') {
          if (value && value.length >= 3) {
            showSuccess(input);
          } else {
            hideValidation(input);
          }
        } else if (input.id === 'school') {
          if (value && value.length >= 3) {
            showSuccess(input);
          } else {
            hideValidation(input);
          }
        } else {
          if (value) {
            showSuccess(input);
          } else {
            hideValidation(input);
          }
        }
        
        updateFormProgress();
      });

      input.addEventListener('focus', () => {
        const wrapper = input.closest('.form-group-wrapper');
        if (wrapper) {
          wrapper.style.transform = 'scale(1.01)';
        }
      });

      input.addEventListener('blur', () => {
        const wrapper = input.closest('.form-group-wrapper');
        if (wrapper) {
          wrapper.style.transform = 'scale(1)';
        }
      });
    });

    // Validación de selects
    selectInputs.forEach(select => {
      select.addEventListener('change', () => {
        if (select.value) {
          const wrapper = select.closest('.form-group-wrapper');
          if (wrapper) {
            const errorEl = wrapper.querySelector('.error-message');
            if (errorEl) {
              errorEl.textContent = '';
            }
          }
        }
        updateFormProgress();
      });
    });

    // Inicializar selector de campus (pills + panel 'Más')
    const campusPills = select('#campusPills');
    if (campusPills) {
      const hiddenInput = select('#campus');
      const pills = [...campusPills.querySelectorAll('.pill')].filter(p=>!p.classList.contains('more-pill'));
      const moreBtn = select('#campusMore');
      const morePanel = select('#campusMorePanel');
      const moreItems = morePanel ? morePanel.querySelectorAll('li') : [];

      const clearActive = () => {
        pills.forEach(p => p.classList.remove('active'));
        moreItems.forEach(li => li.classList.remove('active'));
      };

      const setSelection = (value) => {
        if (!value) return;
        hiddenInput.value = value;
        clearActive();
        // marcar pill si existe
        const matchPill = pills.find(p => p.dataset.value === value);
        if (matchPill) matchPill.classList.add('active');
        // marcar item en more panel si existe
        moreItems.forEach(li => { if (li.dataset.value === value) li.classList.add('active'); });
        showSuccess(hiddenInput);
        updateFormProgress();
      };

      pills.forEach(p => {
        p.addEventListener('click', (e) => {
          setSelection(p.dataset.value);
        });
      });

      moreItems.forEach(li => {
        li.addEventListener('click', (e) => {
          setSelection(li.dataset.value);
          if (morePanel) morePanel.classList.remove('open');
        });
      });

      if (moreBtn && morePanel) {
        moreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          morePanel.classList.toggle('open');
          morePanel.setAttribute('aria-hidden', morePanel.classList.contains('open') ? 'false' : 'true');
        });

        document.addEventListener('click', (e) => {
          if (morePanel.classList.contains('open') && !campusPills.contains(e.target)) {
            morePanel.classList.remove('open');
          }
        });
      }
    }

    // Validación de radios
    radioInputs.forEach(radio => {
      radio.addEventListener('change', () => {
        updateFormProgress();
      });
    });
  };

  /**
   * Actualizar progreso del formulario
   */
  const updateFormProgress = () => {
    const form = select('#form');
    if (!form) return;

    const inputs = select('.form-control-modern', true);
    const radioGroups = new Set();
    const radioInputs = select('input[type="radio"]', true);
    const selectInputs = select('.select-custom', true);

    let filledFields = 0;
    let totalFields = 0;

    // Contar inputs de texto
    inputs.forEach(input => {
      totalFields++;
      if (input.id === 'celular') {
        // Solo contar si tiene 8 dígitos
        const value = input.value.replace(/\D/g, '');
        if (value.length === 8) filledFields++;
      } else if (input.value.trim()) {
        filledFields++;
      }
    });

    // Agrupar y contar radios
    radioInputs.forEach(radio => {
      const name = radio.getAttribute('name');
      if (name) {
        radioGroups.add(name);
      }
    });

    totalFields += radioGroups.size + selectInputs.length;

    // Contar radios seleccionados
    radioGroups.forEach(groupName => {
      if (form.querySelector(`input[name="${groupName}"]:checked`)) {
        filledFields++;
      }
    });

    // Contar selects rellenados
    selectInputs.forEach(selectEl => {
      if (selectEl.value) {
        filledFields++;
      }
    });

    const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    const progressBar = document.getElementById('formProgress');
    const progressPercent = document.getElementById('progressPercent');

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    if (progressPercent) {
      progressPercent.textContent = progress + '%';
    }

    // Actualizar indicador circular si existe
    const circlePath = document.querySelector('.progress-circle .progress');
    const circleText = document.querySelector('.progress-circle .percent-text');
    if (circlePath) {
      // stroke-dasharray maneja el porcentaje sobre 100
      circlePath.setAttribute('stroke-dasharray', `${progress},100`);
    }
    if (circleText) {
      circleText.textContent = progress + '%';
    }
  };

  /**
   * Inicializar al cargar el formulario
   */
  window.addEventListener('load', () => {
    initFormValidation();

    // Cargar fecha y hora
    const fechaHoraEnvioInput = document.getElementById('fechaHoraEnvio');
    const updateDateTime = () => {
      if (fechaHoraEnvioInput) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        fechaHoraEnvioInput.value = formattedDateTime;
      }
    };

    updateDateTime();

    // Manejar envío del formulario
    const form = document.getElementById('form');
    const messageDiv = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');
    const messageText = document.getElementById('messageText');

    if (form) {
      form.addEventListener('submit', function(event) {
        // Actualizar fecha y hora justo antes de enviar
        updateDateTime();
        
        // Mostrar mensaje de éxito después de un pequeño delay
        setTimeout(function() {
          if (messageDiv) {
            messageDiv.style.display = 'flex';
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Deshabilitar botón temporalmente
            if (submitButton) {
              submitButton.disabled = true;
              submitButton.style.opacity = '0.7';
              
              setTimeout(() => {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                form.reset();
                
                // Resetear progreso
                const progressBar = document.getElementById('formProgress');
                const progressPercent = document.getElementById('progressPercent');
                if (progressBar) progressBar.style.width = '0%';
                if (progressPercent) progressPercent.textContent = '0%';
                // Resetear indicador circular si existe
                const circlePathReset = document.querySelector('.progress-circle .progress');
                const circleTextReset = document.querySelector('.progress-circle .percent-text');
                if (circlePathReset) circlePathReset.setAttribute('stroke-dasharray', '0,100');
                if (circleTextReset) circleTextReset.textContent = '0%';
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                  messageDiv.style.display = 'none';
                }, 5000);
              }, 3000);
            }
          }
        }, 300);
      });
    }

    // Inicializar progreso
    updateFormProgress();

    // Agregar efecto de transición suave a los inputs
    const inputs = select('.form-control-modern', true);
    inputs.forEach(input => {
      input.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

})()
