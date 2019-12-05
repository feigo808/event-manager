// 太郁闷了，好了一天的时间终于弄明白了。这个script文件，
// 首先所有的名字要一致才能运作
// 第二，要是加了什么event，要及时地把event的function加上，要不然也会无法继续实行
// 三个字，好坑爹
function init() {
    let _event = {};

    // Get all items from the form by their id
    // $idはutils.jsファイルに定義してある、またそのファイルを呼び込む設定はlayoutのscript tagで指定してます
    const divForm = $id('divForm');
    const selStartTime = $id('startTime');
    const selEndTime = $id('endTime');
    const txtActivity = $id('activity');
    const txtLocation = $id('location');
    const txtNote = $id('note');
    const loading = $id('loading');
    const btnDelete = $id('deleteButton');
    const btnClose = $id('closeButton');
    const btnSave = $id('saveButton');
    const hiddenDate = $id('hiddenDate');

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







    //#region =============== Button Pressed ==============
    // Save event (New or Update)
    function submitForm(e) {
        // validate before saving
        if (validate()) {
            saveEvent();
        }
    }

    // Delete existing event
    function deleteEvent(e) {
        // eslint-disable-next-line no-undef
        Notiflix.Confirm.Show(
            'Confirm Delete',
            'Are you sure to delete the event?',
            'DELETE',
            'Cancel',

            // ok button callback
            function () {
                showLoading();

                const url = `/events/${_event.id}`;
                return fetch(url, {
                    method: 'DELETE',
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.result !== 'ok') {
                            throw new Error(data.message || data);
                        }
                        // window.location.reload() reloads the current page with POST data, 
                        // while window.location.href = window.location.href does not include the POST data.
                        window.location.href = window.location.href + '';
                    })
                    .catch(err => {
                        console.error(err);
                        hideLoading();
                        // alert(err.message);
                        // eslint-disable-next-line no-undef
                        Notiflix.Report.Failure('Error', err.message);
                    });
            },

            // cancel button callback
            function () {
                console.log('Delete canceled.');
            }
        );
    }

    // Hide the Form
    function closeForm(e) {
        divForm.style.display = 'none';
    }
    //#endregion


    //#region ====================== Utils =====================
    // Show Loading mark 
    function showLoading() {
        loading.style.display = 'grid';
    }

    // Hide the Loading mark
    function hideLoading() {

        loading.style.display = 'none';
    }

    function getTimeStr(d) {
        return d.split(' ')[1].substr(0, 5);
    }
    //#endregion


    //#region ==================== Functions ======================
    // Get event info by eventId
    function fetchEvent(id) {
        const url = `/events?id=${id}`;
        //method書いてない時は、デフォルトでGET methodになる￥
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

    // Save the event to DB
    function saveEvent() {
        showLoading();

        const url = `/events/${_event.id}`;
        const body = JSON.stringify(_event);

        // ここではちゃんとmethodをPOSTに指定した
        return fetch(url, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body,
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    alert('kokokokokokokokokokokok');
                    _event = data;
                    console.log('event = ', _event);
                } else {
                    throw new Error(data.message || data);
                }
                window.location.href = window.location.href + '';
            })
            .catch(err => {
                console.error(err);
                hideLoading();
                // alert(err.message);
                // eslint-disable-next-line no-undef
                Notiflix.Report.Failure('Error', err.message);
            });
    }

    // Validate Form info
    function validate() {
        const date = hiddenDate.value;

        // _event.startTime = `${date} ${selStartTime.value}`;
        _event.startTime = `${date} ${selStartTime.value}`;
        _event.endTime = `${date} ${selEndTime.value}`;
        // _event.endTime = `${date} ${selEndTime.value}`;
        _event.activity = txtActivity.value;
        _event.location = txtLocation.value;
        _event.note = txtNote.value;

        const errors = [];

        // Client側でvalidateしたい場合、ここに書く
        // Modelにもうvalidateしたが、やっぱここでもう一度したほうが無難

        if (errors.length) {
            const msg = errors.join(', ');
            // alert(msg);
            // eslint-disable-next-line no-undef
            Notiflix.Report.Failure('Error', msg);
            return false;
        }
        return true;
    }
    //#endregion
}

window.addEventListener('DOMContentLoaded', init);

// eslint-disable-next-line no-undef
Notiflix.Notify.Init();
// eslint-disable-next-line no-undef
Notiflix.Report.Init();
// eslint-disable-next-line no-undef
Notiflix.Confirm.Init();
