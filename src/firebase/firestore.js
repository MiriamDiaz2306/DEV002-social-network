// import { async } from 'regenerator-runtime';
import {
  saveTask, deleteTask, getTask, updateTask, tapLike, dislike, user, auth, dateTask,
} from './configuracion.js';

const tasksContainer = document.getElementById('contenedor-publicaciones');
const taskForm = document.getElementById('task-form');

let editStatus = false;
let id = '';

window.addEventListener('DOMContentLoaded', async () => {
  dateTask((querySnapshot) => {
    
    let html = '';

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      // const fecha=Timestamp.fromDate(new Date())
      const likes = task.likes;
      const likesNumber = likes.length;
      const userId = user().uid;
      const currentLike = likes.indexOf(userId);
      let likeSrc = '';
      const likeImg = () => {
        if (currentLike === -1) {
          likeSrc = 'images/like-logo.png';
        } else {
          likeSrc = './images/heart.png';
        }
      };
      likeImg();

      // Este código tomará la fecha almacenada en createdDateTime, la convertirá a un objeto Date, y luego utilizará toLocaleString() para mostrarla en el formato deseado
     console.log(auth.currentUser)
      html += `
                <div class = 'contenedor-padre'> 
                  <p class="name-post"> ${task.name} </p>
                  <p class="date">${task.createdDateTime.toDate().toLocaleString('es-ES', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
      })} </p>
                    <textarea class ='div-post-publicado'>${task.description}</textarea>`;

      if (task.uid === auth.currentUser.uid) {
        html += `
                        <img src="./images/editlogo2.png" class='btn-edit' data-id="${doc.id}">
                        <img src="./images/deletelogo2.png" class='btn-delete' data-id="${doc.id}"> 
                    <div class="contenedor-likes">
                        <img class="like-logo" data-id="${doc.id}" src='${likeSrc}' alt="heart">
                        <p class="contadorLikes" data-id="${doc.id}"> ${likesNumber}</p>
                    </div>
                `;
      } else {
        html += ` 
                     <div class="contenedor-likes">
                        <img class="like-logo" data-id="${doc.id}" src='${likeSrc}' alt="heart">
                        <p class="contadorLikes" data-id="${doc.id}"> ${likesNumber}</p>
                    </div>
                    </div>
                    `;
      }
    });

    tasksContainer.innerHTML = html;

    const userId = user().uid;
    const botonLike = tasksContainer.querySelectorAll('.like-logo');

    botonLike.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        console.log('id', id)
        const doc = await getTask(id);
        console.log('doc', doc)
        const likes = doc.data().likes;
        const currentLike = likes.indexOf(userId);
        
        console.log(likes);
        if (currentLike === -1) {
         
          tapLike(id, userId);
         
        } else {
        
          dislike(id, userId);
       
        }
      });
    });

    const btnsDelete = tasksContainer.querySelectorAll('.btn-delete');
    btnsDelete.forEach((btn) => {
      btn.addEventListener('click', ({ target: { dataset } }) => {
        if (confirm('¿Estás segura de que deseas eliminar esta publicación?')) {
          deleteTask(dataset.id);
        }
      });
    });

    const btnsEdit = tasksContainer.querySelectorAll('.btn-edit');
    btnsEdit.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const doc = await getTask(e.target.dataset.id);
        console.log(doc.data());
        const task = doc.data();

        taskForm['task-description'].value = task.description;

        editStatus = true;
        id = doc.id;

        taskForm['btn-publicar'].innerText = 'Publicar';
      });
    });
  });
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = taskForm['task-description'];

  if (description.value.trim() === '') {
    alert('No se pueden publicar campos vacíos :(');
  } else {
    if (!editStatus) {
      saveTask(description.value);
    } else {
      updateTask(id, {
        description: description.value,
      });

      editStatus = false;
    }

    taskForm.reset();
  }
});



