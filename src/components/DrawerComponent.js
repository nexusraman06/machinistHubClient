import React, { useState } from 'react'
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Utils from './Utils'
import { Link } from 'react-router-dom'
const DrawerComponent = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List>
          {Utils.MainMenu.map((item, i) => (
            <ListItem key={'Mc' + i} button component={Link} to={item.path}>
              <ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </ListItemIcon> 
            </ListItem>
          ))}
        </List>
      </Drawer>
      <IconButton
        sx={{ marginLeft: 'auto', color: 'white' }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon></MenuIcon>
      </IconButton>
    </>
  )
}

export default DrawerComponent
