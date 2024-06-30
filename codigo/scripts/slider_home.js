const galleryContainer = document.querySelector('.gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['voltar', 'proximo'];
let galleryItems = document.querySelectorAll('.gallery-item');

class Carousel {
    constructor(container, items, controls){
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery(){
        this.carouselArray.forEach(el => {
            el.classList.remove('gallery-item-1', 'gallery-item-2', 'gallery-item-3', 'gallery-item-4', 'gallery-item-5');     
        });

        this.carouselArray.slice(0, 5).forEach((el, i) => {
            el.classList.add(`gallery-item-${i+1}`);
        });
    }

    setCurrentState(direction){
        if (direction.className === 'gallery-controls-voltar'){
            this.carouselArray.unshift(this.carouselArray.pop());
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }
        this.updateGallery();
    }

    setControls(){
        this.carouselControls.forEach(control => {
            galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
            document.querySelector(`.gallery-controls-${control}`).innerText = control;
        });
    }

    useControls(){
        const triggers = [...galleryControlsContainer.childNodes];
        triggers.forEach(control => {
            control.addEventListener('click', e => {
                e.preventDefault();
                this.setCurrentState(control);
            });
        });
    }
}

async function fetchGalleryImages() {
    try {
        const response = await fetch('https://api-tiaw-vercel.vercel.app/usuarios');
        const users = await response.json();
        const images = users.slice(0, 5).map(user => user.galeria1);

        galleryItems.forEach((item, index) => {
            if (images[index]) {
                item.src = images[index];
                item.addEventListener('click', () => {
                    window.location.href = `http://127.0.0.1:5501/codigo/user.html?id=${users[index].id}`;
                });
            }
        });

        exampleCarousel.carouselArray = [...galleryItems];
        exampleCarousel.updateGallery();

    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
    }
}

const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);

exampleCarousel.setControls();
exampleCarousel.useControls();

fetchGalleryImages();