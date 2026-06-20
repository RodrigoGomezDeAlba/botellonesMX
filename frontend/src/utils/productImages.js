import deportiva1l from '../assets/products/deportiva1l.png';
import deportiva750ml from '../assets/products/deportiva750ml.png';
import dinosaurio from '../assets/products/dinosaurio.png';
import familiar2l from '../assets/products/familiar2l.png';
import termico1l from '../assets/products/termico1l.png';
import termoAcero600ml from '../assets/products/termoAcero600ml.png';
import unicornio from '../assets/products/unicornio.png';
import vidrio500ml from '../assets/products/vidrio500ml.png';

const imageByName = [
    { match: ['deportiva', '750'], image: deportiva750ml },
    { match: ['termico', '1l'], image: termico1l },
    { match: ['dinosaurio'], image: dinosaurio },
    { match: ['vidrio', '500'], image: vidrio500ml },
    { match: ['acero', '600'], image: termoAcero600ml },
    { match: ['deportiva', '1l'], image: deportiva1l },
    { match: ['familiar', '2l'], image: familiar2l },
    { match: ['unicornio'], image: unicornio }
];

const normalize = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

export const getProductImage = (product) => {
    const name = normalize(product?.name);
    const localMatch = imageByName.find(({ match }) =>
        match.every(term => name.includes(normalize(term)))
    );

    return localMatch?.image || product?.image_url || '';
};