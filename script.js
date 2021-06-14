/*
    Calendar
    Soubor skriptu

    Autor: Zuzana Kopčilová
    Datum: 6/2021
*/

/* PROMĚNNÉ */

 /* navigace mezi měsíci */
let nav = 0;

/* zvolený den */
let clicked = null; 

/* přidané události */
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('day_blocks');
const weekdays = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'];


/* 
    Při využití funkce 'toLocaleDateString' začíná název měsíce malým písmenem,
    což není jako nadpis vhodné.
    Z toho důvodu bylo vytvořeno pole s názvy měsíců začínajícími velkými písmeny.
*/
const mesice = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];

const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const deleteModal = document.getElementById('deleteModal');
const editModal = document.getElementById('editModal');

const eventTitle = document.getElementById('eventTitleInput');
const newTitleInput = document.getElementById('newTitleInput');


/* FUNKCE   */


/* openModal - zobrazí okno pro přidání/odstranění události */
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteModal.style.display = 'block';

    }
    else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}

/* closeModal - zavře okno pro přidání/odstranění události */
function closeModal() {
    newEventModal.style.display = 'none';
    deleteModal.style.display = 'none';
    editModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitle.value = '';
    newTitleInput.value = '';
    clicked = null;
    load();
}

/* saveEvent - uloží přidanou událost do lokální paměti (pole events) */
function saveEvent() {
    if (eventTitle.value) {
        eventTitle.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitle.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    }
    else {
        eventTitle.classList.add('error');
    }
}


/* deleteEvent - odebere odstraněnou událost z lokální paměti (pole events) */
function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

/* editEvent - otevře okno pro úpravu existující události */
function editEvent(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    document.getElementById('oldEvent').innerText = eventForDay.title;
    editModal.style.display = 'block';
    backDrop.style.display = 'block';

}

/* saveEdit - nahradí existující událost novou */
function saveEdit() {

    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));

    if (newTitleInput.value) {
        newTitleInput.classList.remove('error');
        events.push({
            date: clicked,
            title: newTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    }
    else {
        newTitleInput.classList.add('error');
    }
}

/* load - načtení kalendáře */
function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth()+nav);
    }
    
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month+1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('cs-CZ',{
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const paddingDays = weekdays.indexOf(dateString.split(' ')[0]);

    document.getElementById('month').innerText = `${mesice[month]} ${year}`;

    calendar.innerHTML = '';

    for(let i=1; i <= paddingDays + daysInMonth; i++){
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const thisDay = `${i-paddingDays}. ${month+1}. ${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.find(e => e.date === thisDay);

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);

                
                document.getElementById('editButton').addEventListener('click', () => editEvent(`${i-paddingDays}. ${month+1}. ${year}`));
            }

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            daySquare.addEventListener('click', () => openModal(`${i-paddingDays}. ${month+1}. ${year}`));
        }
        else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }

}

/* initButtons - volá odpovídající funkce při stisknutí tlačítek */
function initButtons() {

    /* tlačítka pro navigaci mezi měsíci */
    document.getElementById('predchozi').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('nasledujici').addEventListener('click', () => {
        nav++;
        load();
    });

    /* tlačítka v okně pro přidání události */
    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);

    /* tlačítka v okně již existující události */
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);

    /* tlačítka v okně úpravy existující události */
    document.getElementById('cancelButton2').addEventListener('click', closeModal);
    document.getElementById('saveButton2').addEventListener('click', saveEdit);

}

initButtons();
load();