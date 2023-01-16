'use strict';

{
	const coverContainer = document.getElementById('cover-container');
	const textContainer = document.getElementById('text-container');
	const titleElement = document.getElementById('title');
	const messageElement = document.getElementById('message');
	const prevButton = document.getElementById('button-prev');
	const nextButton = document.getElementById('button-next');

	let currentPage = 0;

	const pages = [
		{
			imageSrc: '/img/app-onboarding-1.jpg',
			title: 'Fly',
			message: 'Flying just about anything just got more exciting, easy and fun, regardless of your piloting skills!'
		},
		{
			imageSrc: '/img/app-onboarding-2.jpg',
			title: 'Be safe',
			message: 'Your autopilot is monitoring hundreds of vital parameters so your model is always safe'
		},
		{
			imageSrc: '/img/app-onboarding-3.jpg',
			title: 'Command',
			message: 'Pilot your model yourself or tell autopilot to go anywhere you want with just a touch!'
		}
	];


	function preload() {
		for (const page of pages) {
			page.imageObject = getCover(page);
		}
	}


	function getCover(page) {
		if (page.imageObject) {
			return page.imageObject;
		}

		const coverImage = document.createElement('img');
		coverImage.classList.add('cover');
		coverImage.src = page.imageSrc;
		coverImage.alt = 'Cover image';
		Object.assign(coverImage.style, {
			opacity: '0',
			transform: 'translateX(100%)'
		});

		return coverImage;
	}


	function removeElement(element) {
		if (element) {
			element.parentNode.removeChild(element);
		}
	}


	function getTransitionDuration(element, property) {
		const propertyIndex = getComputedStyle(element)
				.transitionProperty
				.split(', ')
				.findIndex(p => p === property);

		const [string, duration, unit] = getComputedStyle(element)
				.transitionDuration
				.split(', ')
				[propertyIndex]
				.match(/([\d.]+)(m)?s/);

		return unit? +duration : +duration * 1000;
	}


	function goToPage(pageNumber) {
		if (!Number.isInteger(pageNumber) || pageNumber < 0) {
			return;
		}
		if (pageNumber > pages.length - 1) {
			localStorage.setItem('intro-viewed', 'true');
			window.location.href = '/';
		}
		const direction = pageNumber > currentPage? 1 : -1;
		const page = pages[pageNumber];
		currentPage = pageNumber;

		const newCover = getCover(page);
		const oldCover = document.getElementById('current-cover');
		coverContainer.appendChild(newCover);

		const coverDuration = getTransitionDuration(newCover, 'opacity');
		const textDuration = getTransitionDuration(textContainer, 'opacity');

		requestAnimationFrame(() => {
			if (oldCover) {
				Object.assign(oldCover.style, {
					opacity: '0',
					position: 'absolute',
					transform: `translateX(${direction * -100}%)`
				});
			}
			Object.assign(newCover.style, {
				opacity: '1',
				transform: 'unset',
				position: 'static'
			});
			Object.assign(textContainer.style, {
				opacity: '0'
			});
			setTimeout(() => {  // After cover transition
				if (oldCover) {
					oldCover.id = '';
				}
				newCover.id = 'current-cover';
			}, coverDuration);
			setTimeout(() => {  // After text out transition
				titleElement.innerText = page.title;
				messageElement.innerText = page.message;
				Object.assign(textContainer.style, {
					opacity: '1'
				});
			}, textDuration);
		});
	}


	nextButton.addEventListener('click', () => {
		goToPage(currentPage + 1);
	});


	prevButton.addEventListener('click', () => {
		goToPage(currentPage - 1);
	});


	preload();
	goToPage(0);
}
