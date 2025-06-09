import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

// As the app would likely support more sports in the future,
// I'd recommend using a more scalable approach for icons, thus keeping imports here.

export const sportIcons = {
  Football: <SportsSoccerIcon fontSize='large' />,
  Basketball: <SportsBasketballIcon fontSize='large' />,
  Tennis: <SportsTennisIcon fontSize='large' />,
};