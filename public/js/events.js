// 太郁闷了，好了一天的时间终于弄明白了。这个script文件，
// 首先所有的名字要一致才能运作
// 第二，要是加了什么event，要及时地把event的function加上，要不然也会无法继续实行
// 三个字，好坑爹
function init() {
    let _event = {};

    // Get all items from the form by their id
    const divForm = document.getElementById('divForm');
    const selStartTime = document.getElementById('startTime');
    const selEndTime = document.getElementById('endTime');
    const txtActivity = document.getElementById('activity');
    const txtLocation = document.getElementById('location');
    const txtNote = document.getElementById('note');
    const loading = document.getElementById('loading');
    const btnDelete = document.getElementById('deleteButton');
    const btnClose = document.getElementById('closeButton');
    const btnSave = document.getElementById('saveButton');
    const hiddenDate = document.getElementById('hiddenDate');

    // Buuton Events
    divForm.addEventListener('submit', submitForm);
    // saveButton.addEventListener('click', saveEvent);
    deleteButton.addEventListener('click', deleteEvent);
    closeButton.addEventListener('click', closeForm);

    // 時間グリッドを押下時発生するイベントの設定 (要確認)
    const eventItem = document.querySelectorAll(
        '.detail-container .detail-item.available, .detail-container .detail-item.booked'
    );
    for (let event of eventItem) {
        event.addEventListener('click', openForm);
    }

    // 時間グリッドを押下時form開くイベント
    function openForm(e) {
        // Get infos from the grid before open the form
        const eventId = e.target.getAttribute('data-id') | 0;
        const startTime = hiddenDate.value + ' ' + e.target.getAttribute('data-start') + ':00';
        const endTime = hiddenDate.value + ' ' + e.target.getAttribute('data-end') + ':00';
        const booked = e.target.getAttribute('data-booked') === 'true';
        // Display form
        divForm.style.display = 'block';
        _event = {};

        showLoading();
        // Update
        if (booked) {
            // Show loading mark while getting the data
            // Get the detail by eventId, set 1 second sleep time
            setTimeout(() => {
                fetchEvent(eventId)
            }, 500);
        }
        // New Event
        else {
            _event = {
                id: 0,
                startTime,
                endTime,
                activity: '',
                location: '',
                note: '',
            };
            hideLoading();
            showEvent();
        };

    }

    function submitForm(e) {

    }

    function deleteEvent(e) {

    }

    // Hide the Form
    function closeForm(e) {
        divForm.style.display = 'none';
    }

    // Show Loading mark 
    function showLoading() {
        loading.style.display = 'grid';
    }

    // Hide the Loading mark
    function hideLoading() {

        loading.style.display = 'none';
    }

    // Get event info by eventId
    function fetchEvent(id) {
        // *This is GET method
        const url = `/events?id=${id}`;

        return fetch(url)
            .then(res => {
                return res.json();
            })
            .then(data => {
                _event = data.length ? data[0] : null;
                hideLoading();
                showEvent();
            })
            .catch(err => {
                console.error(err);
                hideLoading();
                // eslint-disable-next-line no-undef
                Notiflix.Report.Failure('Error', err.message);
            });
    }

    // 取得したイベント情報を再表示する
    function showEvent() {
        selStartTime.value = getTimeStr(_event.startTime);
        selEndTime.value = getTimeStr(_event.endTime);
        txtActivity.value = _event.activity;
        txtLocation.value = _event.location;
        txtNote.value = _event.note;

        // Enable Delete button
        btnDelete.style.display = _event.id ? 'inline' : 'none';
    }

    function getTimeStr(d) {
        return d.split(' ')[1].substr(0, 5);
    }
}

window.addEventListener('DOMContentLoaded', init);
// eslint-disable-next-line no-undef
Notiflix.Notify.Init();
// eslint-disable-next-line no-undef
Notiflix.Report.Init();
// eslint-disable-next-line no-undef
Notiflix.Confirm.Init();
