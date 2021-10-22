import passport from "passport";
import passporLoccal from "passport-local";
import { find } from "lodash";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";

const localStrategy = passporLoccal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});