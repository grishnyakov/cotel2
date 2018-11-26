//Содержит константы, используемые в системе
//Файл должен быть синзронизирован с бд

//Статусы пользователей
const STATUS = {
  'ACTIVE': {id: 0, name: 'Активен', info: 'Пользователь может работать в системе'},
  'NOT_CONFIRMED': {
    id: 1,
    name: 'Не подтверждён',
    info: 'Учётная запись не подтверждена. Требуется подтверждение по e-mail'
  },
  'BLOCKED': {
    id: 2,
    name: 'Заблокирован',
    info: 'Учётная запись заблокирована. пользователь не может работать в системе'
  },
};


function getStatusById(id) {
  for (let index in this) {
    if (id === this[index].id)
      return this[index];
  }
};
STATUS.getStatusById = getStatusById;
module.exports = {STATUS};


