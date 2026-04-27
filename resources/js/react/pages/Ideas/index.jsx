import * as React from "react"
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from "@mui/material";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

import { api } from "../../lib/api";

const STATUS_LABELS = {
    under_review: "Under Review",
    planned: "Planned",
    implemented: "Implemented",
    declined: "Declined",
};

export default function Ideas() {
    const {
        data: ideas,
        isIdeasPending,
        isIdeasError,
    } = useQuery({
        queryKey: ["ideas"],
        queryFn: api.getIdeas,
    });  

    const {
        data: ideaImprovementTypes,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["ideas", "improvement-types"],
        queryFn: api.getImprovementTypes,
    });    

    const [open, setOpen] = React.useState(false); 
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };    

    const queryClient = useQueryClient();

    const submitMutation = useMutation({
        mutationFn: api.submitIdea,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] });    
            handleClose();        
        },
        onError: (error) => {
            //TODO something more descriptive
            alert("error");
        }
    });    

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        submitMutation.mutate(data);
    };

    const upvoteMutation = useMutation({
        mutationFn: (id) => api.upvoteIdea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] });            
        },
        onError: (error) => {
            //TODO something more descriptive
            alert("error");
        }
    });    
    
    const downvoteMutation = useMutation({
        mutationFn: (id) => api.downvoteIdea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] });            
        },
        onError: (error) => {
            //TODO something more descriptive
            alert("error");
        }
    });      

    const upvoteIdea = ($ideaId) => {                         
        upvoteMutation.mutate($ideaId);
    }

    const downvoteIdea = ($ideaId) => {                         
        downvoteMutation.mutate($ideaId);
    }    

    if (isIdeasPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isIdeasError) {
        return (
            <Box>          
                <Typography color="error" sx={{ pt: 4 }}>
                    Failed to load ideas.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                color="success"
                variant="contained"  
                onClick={() => {
                    handleClickOpen();
                }}                  
            >
                Submit New Suggestion
            </Button>             
            <Typography variant="h5" gutterBottom>
                Staff Idea Board
            </Typography>  
            <Dialog                
                open={open}
                onClose={handleClose}
            >   
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Submit new suggestion</DialogTitle>                 
                    <DialogContent>                        
                        <TextField
                            autoFocus
                            required
                            id="title"
                            name="title"
                            label="Title"
                            fullWidth
                            variant="standard"
                        />   
                        <TextField                            
                            required
                            id="description"
                            name="description"
                            label="Description"
                            fullWidth
                            variant="standard"
                        />                    
                        <Select
                            id="improvement_type"
                            name="improvement_type"
                            label="Improvement Type"
                            fullWidth
                            defaultValue={ideaImprovementTypes?.length > 0 ? ideaImprovementTypes[0].id : ""}
                        >
                            {ideaImprovementTypes?.map(({id, label}) => (
                                <MenuItem key={id} value={id}>{label}</MenuItem>
                            ))}
                        </Select>                                                           
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">
                            Submit
                        </Button>
                    </DialogActions>         
                </form>       
            </Dialog>                      
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Improvement Type</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Upvotes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ideas?.map((idea) => (
                            <TableRow key={idea.id} hover>
                                <TableCell>{idea.title}</TableCell>
                                <TableCell sx={{ color: "text.secondary" }}>
                                    {idea.description ?? "—"}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            STATUS_LABELS[idea.status] ??
                                            idea.status
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {idea.improvement_type}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        idea.created_at,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="inherit" onClick={() => downvoteIdea(idea.id)}>
                                        <ArrowDownward />
                                    </IconButton>                                    
                                    {idea.upvote_count}
                                    <IconButton color="inherit" onClick={() => upvoteIdea(idea.id)}>
                                        <ArrowUpward />
                                    </IconButton>                                    
                                </TableCell>
                            </TableRow>
                        ))}
                        {ideas?.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{ color: "text.secondary", py: 4 }}
                                >
                                    No ideas yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
