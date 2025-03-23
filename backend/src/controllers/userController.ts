import User from '../models/user';

// Получить информацию о пользователе
export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить информацию о пользователе
export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: 'Данные обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
