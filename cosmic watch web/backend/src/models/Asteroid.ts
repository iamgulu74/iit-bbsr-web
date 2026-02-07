import mongoose, { Schema, Document } from 'mongoose';

export interface IAsteroid extends Document {
    _id: mongoose.Types.ObjectId;
    nasaId: string;
    name: string;
    nasaJplUrl: string;
    absoluteMagnitude: number;
    estimatedDiameter: {
        min: number;
        max: number;
    };
    isPotentiallyHazardous: boolean;
    closeApproachData: {
        date: Date;
        dateFull: string;
        epochDate: number;
        relativeVelocity: {
            kmps: string;
            kmph: string;
            mph: string;
        };
        missDistance: {
            astronomical: string;
            lunar: string;
            kilometers: string;
            miles: string;
        };
        orbitingBody: string;
    }[];
    riskScore?: number;
    riskCategory?: 'low' | 'medium' | 'high' | 'critical';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    orbitalData?: {
        eccentricity: number;
        semiMajorAxis: number;
        inclination: number;
        ascendingNodeLongitude: number;
        orbitalPeriod: number;
        meanAnomaly: number;
        perihelionArgument: number;
    };
    lastUpdated: Date;
}

const AsteroidSchema: Schema = new Schema({
    nasaId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nasaJplUrl: { type: String },
    absoluteMagnitude: { type: Number },
    estimatedDiameter: {
        min: { type: Number },
        max: { type: Number }
    },
    isPotentiallyHazardous: { type: Boolean },
    closeApproachData: [{
        date: { type: Date },
        dateFull: { type: String },
        epochDate: { type: Number },
        relativeVelocity: {
            kmps: { type: String },
            kmph: { type: String },
            mph: { type: String }
        },
        missDistance: {
            astronomical: { type: String },
            lunar: { type: String },
            kilometers: { type: String },
            miles: { type: String }
        },
        orbitingBody: { type: String }
    }],
    riskScore: { type: Number },
    riskCategory: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    orbitalData: {
        eccentricity: Number,
        semiMajorAxis: Number,
        inclination: Number,
        ascendingNodeLongitude: Number,
        orbitalPeriod: Number,
        meanAnomaly: Number,
        perihelionArgument: Number
    },
    lastUpdated: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

AsteroidSchema.virtual('riskLevel').get(function () {
    if (this.riskScore > 75) return 'critical';
    if (this.riskScore > 50) return 'high';
    if (this.riskScore > 25) return 'medium';
    return 'low';
});

export default mongoose.model<IAsteroid>('Asteroid', AsteroidSchema);
