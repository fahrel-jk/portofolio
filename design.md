# Portfolio Design System

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050B1F` | Main background |
| `--bg-secondary` | `#081B2E` | Alternating section backgrounds |
| `--card-bg` | `rgba(12, 35, 52, 0.75)` | Glass cards |
| `--accent` | `#58F6E8` | Primary accent / highlights |
| `--accent-secondary` | `#00D9FF` | Secondary accent / gradients |
| `--text` | `#FFFFFF` | Primary text |
| `--text-secondary` | `#C6D0D8` | Body text / descriptions |

## Typography
- **Primary Font**: Poppins — headings, nav, buttons
- **Secondary Font**: Inter — body text, descriptions
- **Hierarchy**: 72px → 56px → 28px → 20px → 18px → 16px → 14px → 13px

## Design Patterns
- **Glassmorphism**: `backdrop-filter: blur(20px)` + semi-transparent bg + subtle border
- **Glow Effects**: `box-shadow` with accent color at 0.3-0.4 opacity
- **Floating Animation**: `@keyframes float` — 6s infinite translateY
- **Gradient Accents**: `linear-gradient(135deg, #58F6E8, #00D9FF)`

## Responsive Breakpoints
| Breakpoint | Target |
|------------|--------|
| ≤ 1024px | Tablet |
| ≤ 768px | Mobile |
| ≤ 480px | Small Mobile |

## External Dependencies (CDN)
- AOS 2.3.1 — scroll animations
- GSAP 3.12.5 + ScrollTrigger — advanced animations
- SwiperJS 11 — certification slider
- Font Awesome — icons (local install)
