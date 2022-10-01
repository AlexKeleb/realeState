"use strict";

const ratings = document.querySelectorAll(".rating");
if (ratings.length > 0) {
  initRatings();
}

// Основная функция
function initRatings() {
  let ratingActive;
  let ratingValue;
  // бегаем по всем рейтингам на странице
  for (let index = 0; index < ratings.length; index++) {
    const rating = ratings[index];
    initRating(rating);
  }

  //инициализируем конкретный рейтинг
  function initRating(rating) {
    initRatingVars(rating);

    setRatingActiveWidth();

    if (rating.classList.contains("rating_set")) {
      setRating(rating);
    }
  }

  //инициализация переменных
  function initRatingVars(rating) {
    ratingActive = rating.querySelector(".rating__active");
    ratingValue = rating.querySelector(".rating__value");
  }
  //изменяем ширину активных звезд
  function setRatingActiveWidth(index = ratingValue.innerHTML) {
    const ratingActiveWidth = index / 0.05;
    ratingActive.style.width = `${ratingActiveWidth}%`;
  }

  //возможность указать оценку
  function setRating(rating) {
    const ratingItems = rating.querySelectorAll(".rating__item");
    for (let index = 0; index < ratingItems.length; index++) {
      const ratingItem = ratingItems[index];
      ratingItem.addEventListener("mouseenter", function (e) {
        //обновление переменных
        initRatingVars(rating);
        //обновление активных звезд
        setRatingActiveWidth(ratingItem.value);
      });
      ratingItem.addEventListener("mouseleave", function (e) {
        //обновление активных звезд
        setRatingActiveWidth();
      });
      ratingItem.addEventListener("click", function (e) {
        //обновление переменных
        initRatingVars(rating);

        if (rating.dataset.ajax) {
          //"отправить" на сервер
          setRatingValue(ratingItem.value, rating);
        } else {
          //отобразить указанную оценку
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        }
      });
    }
  }

  async function setRatingValue(value, rating) {
    if (!rating.classList.contains("rating_sending")) {
      rating.classList.add("rating_sending");

      //отправка данных (value) на сервер
      let response = await fetch("rating.json", {
        method: "GET",

        // body: JSON.stringify({
        //   userRating: value,
        // }),
        // headers: {
        //   "content-type": "application/json",
        // },
      });
      if (response.ok) {
        const result = await response.json();

        //получаем новый рейтинг
        const newRating = result.newRating;

        //вывод нового среднего результата
        ratingValue.innerHTML = newRating;

        //обновление активных звезд
        setRatingActiveWidth();

        //имитируем запрос на сервер через задержку
        setTimeout(() => {
          rating.classList.remove("rating_sending");
        }, 300);
      } else {
        alert("Ошибка");

        rating.classList.remove("rating_sending");
      }
    }
  }
}
