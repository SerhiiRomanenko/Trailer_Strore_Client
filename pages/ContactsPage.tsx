import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import BuildingOfficeIcon from "../components/icons/BuildingOfficeIcon";
import PhoneIcon from "../components/icons/PhoneIcon";
import EnvelopeIcon from "../components/icons/EnvelopeIcon";
import ClockIcon from "../components/icons/ClockIcon";

const ContactsPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    document.title = "Контакти | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Зв'яжіться з нами для консультації та замовлення причепів. Адреса, телефон та email магазину Trailers."
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    setIsSent(true);
    setFormState({ name: "", email: "", message: "" });
    setTimeout(() => setIsSent(false), 5000);
  };

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-4xl font-black text-slate-900 mb-8 text-center">
        Контакти
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Зв'яжіться з нами
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="flex items-start gap-4">
                <BuildingOfficeIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Наша адреса</h3>
                  <p>
                    Київська обл., Бучанський р-н, смт. Ворзель, вул. Яблунська,
                    11
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PhoneIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Телефон</h3>
                  <a
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                    href="tel:380679372731"
                  >
                    +38 (067) 937-27-31
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Email</h3>
                  <a
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                    href="mailto:serhiiromanenko13@gmail.com"
                  >
                    serhiiromanenko13@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ClockIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Години роботи
                  </h3>
                  <p>Пн - Пт: 09:00 - 18:00</p>
                  <p>Сб - Нд: Вихідний</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Наше розташування
            </h2>
            <div className="rounded-lg overflow-hidden shadow-md border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2537.409390299696!2d30.13867621571408!3d50.53326177948602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d43c7b3c2e171b%3A0x6e7b5f1a7d6e6a1d!2z0LLRg9C30LHQvtC20LPRgNCw0LLQuNC30LAsINCS0L3QsNCx0LXRgNGB0YLRjCwg0JrQuNC10YDQsNC00L3QsNGA0LAg0L7QvdGW0YAg0JrQuNC10YDQsNC00L3QsNGA0LA!5e0!3m2!1suk!2sua!4v1717835564883!5m2!1suk!2sua"
                className="w-full h-80 border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта розташування"
              ></iframe>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Напишіть нам
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Ваше ім'я
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Ваш Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Повідомлення
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <Button type="submit" variant="primary" className="w-full">
                  Надіслати повідомлення
                </Button>
              </div>
              {isSent && (
                <p className="text-center text-emerald-600 font-medium mt-4">
                  Дякуємо! Ваше повідомлення надіслано.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
