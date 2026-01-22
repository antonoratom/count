const cards = document.querySelectorAll('.memory-game-card_bl');
    let firstCard = null;
    let lockBoard = false;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (lockBoard || card.classList.contains('is-flipped')) return;

            card.classList.add('is-flipped');

            if (!firstCard) {
                firstCard = card;
                return;
            }

            const isMatch =
                firstCard.getAttribute('back-side') ===
                card.getAttribute('back-side');

            if (isMatch) {
                // keep both flipped (pair found)
                firstCard = null;
            } else {
                // flip back after delay
                lockBoard = true;
                setTimeout(() => {
                    firstCard.classList.remove('is-flipped');
                    card.classList.remove('is-flipped');
                    firstCard = null;
                    lockBoard = false;
                }, 800);
            }
        });
    });