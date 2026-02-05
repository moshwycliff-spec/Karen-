
        const { jsPDF } = window.jspdf;

        // Phone number auto-format (US/UK/UG style)
        document.getElementById('phone').addEventListener('input', function(e) {
            let input = e.target;
            let value = input.value.replace(/\D/g, ''); // Remove non-digits
            let formatted = '';

            if (value.length === 0) {
                input.value = '';
                return;
            }

            // Detect country code
            if (value.startsWith('1') && value.length > 1) {
                // US/CA: +1 (555) 123-4567
                value = value.substring(1);
                if (value.length >= 3) formatted += `(${value.substring(0,3)}`;
                if (value.length >= 6) formatted += `) ${value.substring(3,6)}`;
                if (value.length >= 10) formatted += `-${value.substring(6,10)}`;
                else if (value.length > 6) formatted += `-${value.substring(6)}`;
                input.value = `+1 ${formatted}`;
            } else if (value.startsWith('44') && value.length > 2) {
                // UK: +44 7911 123456
                value = value.substring(2);
                if (value.length >= 4) formatted = ` ${value.substring(0,4)}`;
                if (value.length >= 6) formatted += ` ${value.substring(4,6)}`;
                if (value.length > 6) formatted += ` ${value.substring(6,11)}`;
                input.value = `+44${formatted}`;
            } else if (value.startsWith('256') && value.length > 3) {
                // Uganda: +256 792 915 940
                value = value.substring(3);
                if (value.length >= 3) formatted = ` ${value.substring(0,3)}`;
                if (value.length >= 6) formatted += ` ${value.substring(3,6)}`;
                if (value.length > 6) formatted += ` ${value.substring(6,9)}`;
                input.value = `+256${formatted}`;
            } else if (value.length >= 1) {
                // Generic: +XX XXX XXX XXX
                if (value.length >= 1) formatted = `+${value.substring(0,1)}`;
                if (value.length >= 4) formatted += ` ${value.substring(1,4)}`;
                if (value.length >= 7) formatted += ` ${value.substring(4,7)}`;
                if (value.length > 7) formatted += ` ${value.substring(7,10)}`;
                input.value = formatted;
            } else {
                input.value = '+' + value;
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('name').focus();
        });

        // Navigation handlers (same as before)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.hostname && this.hostname !== location.hostname) return;
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    document.getElementById('nav-menu').classList.remove('active');
                    document.getElementById('menu-btn').querySelector('i').className = 'fa-solid fa-bars';
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', () => {
            document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 100);
        });

        const menuBtn = document.getElementById('menu-btn');
        const navMenu = document.getElementById('nav-menu');
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.querySelector('i').className = navMenu.classList.contains('active') 
                ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
        document.addEventListener('click', e => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                menuBtn.querySelector('i').className = 'fa-solid fa-bars';
            }
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('active'));
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // ✅ MAIN: Send Inquiry
        function sendInquiry() {
            const name = document.getElementById('name').value.trim();
            const country = document.getElementById('country').value;
            const phone = document.getElementById('phone').value.trim();
            const tour = document.getElementById('tour').value;
            const msg = document.getElementById('message').value.trim();
            const consent = document.getElementById('consent').checked;

            if (!name || !country) {
                alert("Please provide your name and country.");
                return;
            }
            if (!consent) {
                alert("Please consent to data processing.");
                return;
            }

            const submitBtn = document.getElementById('submit-btn');
            const loader = document.getElementById('submit-loader');
            const submitText = document.getElementById('submit-text');
            loader.style.display = 'inline-block';
            submitText.style.display = 'none';
            submitBtn.disabled = true;

            try {
                const now = new Date();
                const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                // Build message
                const lines = [
                    `✨ *KAMARI LUXURIOUS TOURS — INQUIRY* ✨`,
                    `────────────────────────────────`,
                    `📅 *Date & Time:* ${date}, ${time}`,
                    `🌍 *Country:* ${country}`,
                    `👤 *Client Name:* ${name}`,
                    ...(phone ? [`📱 *Phone:* ${phone}`] : []),
                    `🎯 *Expedition:* ${tour}`,
                    `────────────────────────────────`
                ];

                if (msg) {
                    lines.push(`💬 *Special Requests:*`);
                    lines.push(...msg.split('\n').map(line => `> ${line}`));
                } else {
                    lines.push(`💡 No special requests.`);
                }

                lines.push(
                    ``,
                    `🏆 *The Kamari Promise:*`,
                    `"I personally oversee every itinerary from the first email to the final departure. You are not a booking; you are our guest."`,
                    `— Ampiire Paul, CEO `,
                    `────────────────────────────────`,
                    `📧 paulkamari45@gmail.com `,
                    `📱 +256 792 915 940 `,
                    `📍 P.O Box 199058, Kampala GPO `,
                    ``,
                    `#PearlOfAfrica #LuxurySafariUganda`
                );

                const formattedMsg = lines.join('\n');
                const whatsappUrl = `https://wa.me/256792915940?text=${encodeURIComponent(formattedMsg)}`;

                // ✅ Auto-copy for desktop users
                if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    navigator.clipboard.writeText(whatsappUrl).then(() => {
                        showToast();
                        alert("WhatsApp link copied to clipboard! Paste it into WhatsApp Desktop or click OK to open in browser.");
                        window.open(whatsappUrl, '_blank');
                    }).catch(err => {
                        console.warn("Copy failed, opening directly:", err);
                        window.open(whatsappUrl, '_blank');
                    });
                } else {
                    // Mobile: open directly
                    window.open(whatsappUrl, '_blank');
                }

                // Generate PDF in background
                generatePDF(name, country, phone, tour, msg, date, time);

                setTimeout(() => resetButton(), 800);

            } catch (err) {
                alert("An error occurred. Please try again.");
                console.error(err);
                resetButton();
            }
        }

        function showToast() {
            const toast = document.getElementById('copy-toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function resetButton() {
            const loader = document.getElementById('submit-loader');
            const submitText = document.getElementById('submit-text');
            const btn = document.getElementById('submit-btn');
            loader.style.display = 'none';
            submitText.style.display = 'inline';
            btn.disabled = false;
        }

        // ✅ PDF Generator — now includes Phone & Country
        function generatePDF(name, country, phone, tour, msg, date, time) {
            try {
                const doc = new jsPDF();
                const gold = [212, 175, 55];
                const forest = [27, 48, 34];

                doc.setFont('helvetica', 'bold').setTextColor(...gold).setFontSize(24);
                doc.text("KAMARI LUXURIOUS TOURS", 105, 30, { align: 'center' });
                doc.setFontSize(12).setTextColor(11, 26, 16);
                doc.text("Uganda • The Pearl of Africa", 105, 38, { align: 'center' });

                doc.setDrawColor(...gold).setLineWidth(0.5).line(40, 45, 170, 45);
                doc.setTextColor(...forest).setFontSize(18);
                doc.text("Personal Expedition Inquiry", 105, 60, { align: 'center' });

                doc.setFontSize(11).setTextColor(0);
                let y = 75;
                const add = (label, val) => {
                    if (!val) return;
                    doc.setFont('helvetica', 'bold').text(label, 40, y);
                    doc.setFont('helvetica', 'normal').text(val, 80, y);
                    y += 8;
                };

                add("Client Name:", name);
                add("Country:", country);
                add("Phone:", phone);
                add("Expedition:", tour);
                add("Date Sent:", `${date}, ${time}`);
                add("Data Consent:", "✅ Provided");

                if (msg) {
                    y += 5;
                    doc.setFont('helvetica', 'bold').text("Special Requests:", 40, y);
                    y += 5;
                    doc.setFont('helvetica', 'normal');
                    doc.text(doc.splitTextToSize(msg, 120), 40, y);
                }

                y += 12;
                doc.setFont('times', 'italic').setFontSize(10).setTextColor(...forest);
                const quote = `"I personally oversee every itinerary from the first email to the final departure. You are not a booking; you are our guest."`;
                doc.text(doc.splitTextToSize(quote, 130), 40, y);
                y += 8;
                doc.setFont('helvetica', 'bold').setTextColor(...gold);
                doc.text("— Ampiire Paul, CEO", 40, y + 5);

                y = 275;
                doc.setFontSize(9).setTextColor(100);
                doc.text("Generated on-site at kamari-tours.com", 105, y, { align: 'center' });
                doc.text("© 2026 Kamari Luxurious Tours • URSB & UTB Registered", 105, y + 5, { align: 'center' });

                doc.save(`Kamari_Inquiry_${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

            } catch (e) {
                console.error("PDF Error:", e);
            }
        }