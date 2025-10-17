import { Badge, Box, Button, Divider, Fab, Icon, List, ListItem, Paper, TextField, Typography } from "@mui/material"
import { Add, ShoppingCart } from "@mui/icons-material"
import { useState } from "react"
import { Expense } from "../models/expense.model"
import exp from "constants"


interface ExpenseForm {
    description: string,
    amount: number,
}

export const Expenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [totalExpenses, setTotalExpenses] = useState<number>(0)
    const [totalCash, setTotalCash] = useState<number>(0)
    const [expenseForm, setExpenseForm] = useState<ExpenseForm>({ description: '', amount: 0 })

    const handleNewExpense = () => {
        setExpenses([...expenses, {
            id: Math.random().toString(36).substring(2, 15),
            description: expenseForm.description,
            amount: expenseForm.amount,
            date: new Date().toISOString(),
        }])
        setTotalExpenses(totalExpenses + expenseForm.amount)
        setTotalCash(totalCash - expenseForm.amount)
        setExpenseForm({ description: '', amount: 0 })
    }

    return <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} >
            <Fab color="primary" aria-label="add">
                <Add />
            </Fab>
        </Box>
        {JSON.stringify(expenseForm)}
        <Box sx={{ width: { sm: '70%', xs: '100%' }, mr: 'auto', ml: 'auto', mt: { xs: 2 } }}>
            <TextField fullWidth label="Description" variant="outlined" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
            <TextField fullWidth label="Amount" variant="outlined" sx={{ mt: 2 }} slotProps={{
                input: {
                    inputMode: 'numeric',
                    startAdornment: <Typography sx={{pr: 1}}>TZS</Typography>
                
                }
            }} value={
                expenseForm.amount === 0 ? '' :
                    new Intl.NumberFormat('en-US').format(expenseForm.amount)
            }
                onChange={(e) => {
                    // Remove all non-numeric characters except for decimal point
                    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                    // Handle potential multiple decimal points
                    const parts = rawValue.split('.');
                    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                    setExpenseForm({
                        ...expenseForm,
                        amount: formattedValue ? Number(formattedValue) : 0
                    });
                }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }} >
                <Button variant="contained" color="primary" onClick={handleNewExpense} >Add Expense</Button>
            </Box>
        </Box>
        <List>

            {expenses.length === 0 && <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>No expenses yet</Typography>}

            {expenses.map(expense => <>
                <ListItem>
                    <ShoppingCart />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', width: '100%', pl: 2 }}   >
                        <Typography variant="h6">{expense.description}</Typography>
                        <Typography variant="h6"> TZS {new Intl.NumberFormat('en-US').format(expense.amount)}</Typography>
                    </Box>
                </ListItem>
                <Divider />
            </>)}
        </List>


        {expenses.length > 0 && <><Typography variant="h6" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold' }}>Total Expenses: TZS {new Intl.NumberFormat('en-US').format(totalExpenses)}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'right', fontWeight: 'bold' }}>Total Cash: TZS {new Intl.NumberFormat('en-US').format(totalCash)}</Typography></>}
    </Paper>
}