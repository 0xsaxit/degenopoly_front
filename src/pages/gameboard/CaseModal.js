/* eslint-disable */
import { useDispatch, useSelector } from 'react-redux';
// material
import { Box, Dialog } from '@mui/material';

// ----------------------------------------------------------------------
import { setCaseModal } from '../../actions/manager';


export default function CaseModal() {
    const dispatch = useDispatch();
    const open = useSelector(state => state.manager.caseModalOpen);
    const curPos = useSelector(state => state.manager.curPos);

    const handleClose = () => {
        dispatch(setCaseModal(false));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            {/* <DialogTitle>Use Google's location service?</DialogTitle> */}
            {/* <DialogContent> */}
            <Box component='img' src={`/static/card/${curPos}.svg`} width='400px' height='680px' sx={{  width: '395px', height: '655px' }} />

            {/* </DialogContent> */}
        </Dialog>
    );
}
