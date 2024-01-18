import React from 'react'
import { Redirect, Slot } from 'expo-router';

export default function AppLayout() {

    if (true) {
        return <Redirect href='/login' />;
    }

    return <Slot />;
    }