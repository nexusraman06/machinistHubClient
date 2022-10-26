import React, { useState } from 'react'
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
const DrawerComponent = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <ListItemText>Products</ListItemText>
            </ListItemIcon>
          </ListItemButton>
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
