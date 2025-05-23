import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    college_id: {
      type: String,
      required: true,
      unique: true,
    },
    college_name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    Batch_passing: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwECB//EADoQAAICAQEGAgYIBAcAAAAAAAABAgMEEQUSITFBURNhBiIyUnGxFCNCgZGhwdEVQ+HwJDM1U2KSsv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI+dkfRsd2Jay5RXmB2sshXHesnGMe7ehGltLEX85P4JlBbbO6bnbNyk+rZ8AaD+KYn+4/+rPqO0cSX83T4pmdAGrhOFkN+uSlF9YvU+jL4+RbjT36paPs+TNBh5UMuvehwkvaj2YEgAAAAAAAAAAAAAAABGazsmWRfNyb3U9Ix15Gl6opNj0K3bcINaqE5Saflrp+egHtWwc+2tT8OMNeKU5aM8/gW0U9PAT899GxAGSh6OZ75+FH4zPqXo5mxXCdMvJSf7GrAGCysW/EnuZFbhLmuz+DOuy7nTmR92z1ZfoX/AKVRT2dCTXFWrR/czNYqbyql/wA18wNQB5gAAAAAAAAAAAAAAET0fp12rm2+42tfNv8AoS0tWl3Z32biyxsnMUtGpzjJPvw/fUCeAAAAAqvSaDlsttL2Zxf6fqZrZkd7PpT76/gmzbX0wyKZ02rWE1pIzuyNmTjtTI118KhuG++rfL8gLAH1ZHcslHs9D5AAAAAAAAAAAAAAHLiWsdHFPutSqLHHsjOuKTWqXFAdQAAAAA8e7BN6JLmz0jZd0dxwi9W+HDoBDlJyk5PrxPAAAAAAAAAAAAAAAAdcWW7fHXk+ByGunFdALYHOi1W1p9eqOgAA8bSWrfAD5vko0zflwKwkZFkr5KEPZ1/Ej/EAAAAAAAAAAAAAAAAAAAO1Gu9LRkpWyXREajWORGD9zl5viS90D5dsnySRzmpT4yep23Txgc4QSepXX5Cr2jLGkl60VKDT/J/mS9oZkMLGlbLRy5Qj7zMdZdbZe75TfiN7295gaoETAzI5VaT0Vq9qPfzRLAAAAAAAAAAAADldk00L62yKfbm/wKzJ2vJ+rjQ3V70+YFpddXRHetmorzImLmyzs6uiiLjVrrOT5tL5FHOc7JuVk3J929S22AnCORbBeu0oQfbq38gNAov6Wpf3yJJFx5NRXi8ZLr3FttvHc0QEiTOdtkKq5WWvSEU3JnGnI3mo26Rl36Modu7R+kWvHqf1UH6zX2pfsBC2lmyzsl2S1UFwhHsiKAB6m0002muqJ+LtS2r1bvrY9/tIrwBqMfIqyIb1U0+66r4o6mUhOVc1OuTjJdU9CyxtsTjpHIjvL3o8wLkHOjIqyI602KXl1R0AAAAVe2smdahTXNx3lvS0LQzW0bfHzLJL2U91fBAR/mAADNH6PV/4Fyf2pv8AQzjNTsJabLp+Mv8A0wJ6WgB83WwpqnZN6RgtWBWbcyVj0+FD/Ms7dF3M4uR1ysieVkTunzk+C91djkAAAAAAAAB7GUoSUoScZLk0y92TmSyK5QtlrZDjr3RQkvZdnhZtfab3X9/9QNEAAOWTJwxrZR4NQbX4GXQAAAAGavYv+l0ff82ABNKX0ltmoU1J6Qlq5LvpyAAoUAAAAAAAAAAB7FuMlJPRp6oADWgAD//Z',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
