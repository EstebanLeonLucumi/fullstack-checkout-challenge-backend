import { PrismaClient } from '../src/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const [mbappe, product] = await prisma.$transaction(async (tx) => {
    const mbappe = await tx.customer.create({
      data: {
        email: 'mbappe@mail.com',
        full_name: 'Kylian Mbappe',
      },
    });

    const product = await tx.product.createMany({
      data: [
        {
          name: 'Nike Mercurial Superfly 10 Elite "Kylian Mbappé"',
          description:
            '¿La velocidad es tu obsesión? También la de Kylian Mbappé. Por eso, creamos estos guayos Elite con una unidad Air Zoom mejorada de 3/4 de largo. Les ofrecen a ti y a Kylian la propulsión necesaria para abrirse paso desde la línea de fondo. Esto resulta en los guayos Mercurial más responsivos que hemos creado hasta la fecha, porque tú exiges grandeza de ti mismo y de tus tenis.',
          amount: 1629950,
          currency: 'COP',
          image:
            'https://nikeco.vtexassets.com/arquivos/ids/911873-1200-auto?v=638981457686030000&width=1200&height=auto&aspect=true',
          stock: 100,
        },
        {
          name: 'Nike Mercurial Vapor 16 Elite "Vini Jr."',
          description:
            'Mientras Vini Jr. vuela sobre el campo a velocidades vertiginosas, las Mercurial lo elevan a nuevas alturas. El diseño degradado de sus Vapor 16 Elite combina los colores del club donde debutó con los de la selección brasileña, donde empezó y hacia dónde va. Con la amortiguación elástica Air Zoom, una nueva placa de tracción y el revolucionario material Gripknit, liberan su aceleración explosiva hacia el futuro.',
          amount: 1067970,
          currency: 'COP',
          image:
            'https://nikeco.vtexassets.com/arquivos/ids/866026-1200-auto?v=638836275078170000&width=1200&height=auto&aspect=true',
          stock: 100,
        },
        {
          name: 'Nike Phantom 6 Low Academy "Erling Haaland"',
          description:
            'Estos Phantom 6 Academy están inspirados en el fuego interior de Erling Haaland que alimenta su fiebre goleadora. Potencia tu precisión con una zona de contacto NikeSkin, ubicada donde más la necesitas para lograr tiros precisos. La textura adherente te ayuda a aprovechar las oportunidades de gol al mejorar el contacto del pie con el balón.',
          amount: 455960,
          currency: 'COP',
          image:
            'https://nikeco.vtexassets.com/arquivos/ids/866026-1200-auto?v=638836275078170000&width=1200&height=auto&aspect=true',
          stock: 100,
        },
        {
          name: 'Nike Phantom 6 Low Elite',
          description:
            '¿Te obsesiona la precisión? A nosotros también. Por eso hemos diseñado los Phantom 6 Elite con el revolucionario Gripknit para potenciar tu precisión. La textura adherente mejora el contacto del pie con el balón y ayuda a aprovechar cualquier oportunidad, porque fallar no es una opción. Te da una ventaja inigualable para anotar goles al combinarla con la placa de tracción Cyclone 360 para todos esos cortes rápidos.',
          amount: 1529950,
          currency: 'COP',
          image:
            'https://nikeco.vtexassets.com/arquivos/ids/935292-1200-auto?v=639032193259700000&width=1200&height=auto&aspect=true',
          stock: 100,
        },
        {
          name: 'Nike Mercurial Vapor 16 Elite',
          description:
            '¿La velocidad es tu obsesión? También para las mayores estrellas del fútbol. Por eso, creamos estos tacos Elite con una unidad Air Zoom mejorada de 3/4 de largo. Les ofrece a ti y a los jugadores más rápidos del deporte la sensación de propulsión necesaria para abrirse paso desde la línea de fondo. Esto resulta en los tacos Mercurial más responsivos que hemos creado hasta la fecha, porque tú exiges grandeza de ti mismo y de tus tenis.',
          amount: 1529950,
          currency: 'COP',
          image:
            'https://nikeco.vtexassets.com/arquivos/ids/940843-1200-auto?v=639028057227600000&width=1200&height=auto&aspect=true',
          stock: 100,
        },
      ],
    });

    return [mbappe, product];
  });

  console.log([mbappe, product]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
