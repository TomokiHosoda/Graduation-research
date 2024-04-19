import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export type MyDialogProps = {
    onClose: (value: string) => void
    title?: string
    message?: string
}

export function MyDialog(props: MyDialogProps) {
 const { onClose, title, message } = props
 
 const transition = () => {
  <Link to = {`/post/`}></Link>
 }

 return (
    <Dialog open onClose={() => onClose('close')}>
     <DialogTitle>{title}</DialogTitle>
     <DialogContent>
       <DialogContentText>{message}</DialogContentText>
     </DialogContent>
     <DialogActions>
        <Button onClick={transition}>
          OK
        </Button>
        <Button onClick={() => onClose('cancel')} autoFocus>
         Cancel
       </Button>
     </DialogActions>
   </Dialog>
 )
}