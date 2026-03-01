# 📸 Imagens do Projeto — Emmanuel Bezerra

Coloque as imagens nesta pasta com os nomes abaixo:

| Arquivo | Descrição | Uso no site |
|---------|-----------|-------------|
| `logo-banner.png` | Logo "EB" + "Emmanuel Bezerra Desenvolvedor Full Stack" (fundo azul) | Header, Footer, About |
| `mockup-phone.png` | Mockup do celular na cidade | Landing page, seção Hero/Portfolio |
| `foto-perfil.jpg` | Foto pessoal de perfil | Seção Sobre, Admin sidebar |

## Como usar no Next.js

```tsx
import Image from "next/image";

<Image src="/images/logo-banner.png" alt="Emmanuel Bezerra" width={400} height={120} />
<Image src="/images/mockup-phone.png" alt="Mockup mobile" width={600} height={400} />
<Image src="/images/foto-perfil.jpg" alt="Emmanuel Bezerra" width={300} height={300} />
```
