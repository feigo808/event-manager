// 太郁闷了，好了一天的时间终于弄明白了。这个script文件，
// 首先所有的名字要一致才能运作
// 第二，要是加了什么event，要及时地把event的function加上，要不然也会无法继续实行
// 三个字，好坑爹

function init() {
    let _event = {};

    // Get all items from the id
    const divForm = document.getElementById('divForm');
    const selStartTime = document.getElementById('startTime');
    const selEndTime = document.getElementById('endTime');
    const txtActivity = document.getElementById('activity');
    const txtLocation = document.getElementById('location');
    const txtNote = document.getElementById('note');
    // const hdnId = document.getElementById('id');
    // const hdnDate = document.getElementById('date');
    const loading = document.getElementById('loading');
    const btnDelete = document.getElementById('deleteButton');
    const btnClose = document.getElementById('closeButton');
    const btnSave = document.getElementById('saveButton');
    divForm.addEventListener('submit', submitForm);
    // saveButton.addEventListener('click', saveEvent);
    deleteButton.addEventListener('click', deleteEvent);
    closeButton.addEventListener('click', closeForm);
    // 時間グリッドを押下時発生するイベントの設定 (要確認)
    const eventItem = document.querySelectorAll(
        '.detail-container .detail-item.available, .detail-container .detail-item.booked'
    );
    alert('Hey000');
    for (let event of eventItem) {
        event.addEventListener('click', openForm);
    }

    // 時間グリッドを押下時form開くイベント
    function openForm(e) {
        alert('Hey444');
        divForm.style.display = 'block';
        console.log('how about hereeeeeee');
    }

    function submitForm(e) {

    }

    function deleteEvent(e) {

    }

    function closeForm(e) {

    }
}

window.addEventListener('DOMContentLoaded', init);
// eslint-disable-next-line no-undef
Notiflix.Notify.Init();
// eslint-disable-next-line no-undef
Notiflix.Report.Init();
// eslint-disable-next-line no-undef
Notiflix.Confirm.Init();
