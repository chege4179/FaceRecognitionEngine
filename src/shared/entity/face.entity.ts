import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";



@Entity('FACES')
export class FaceEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    idNo: string;

    @Column()
    name: string;

    @Column()
    faceId: string;

    @Column()
    imageUrl: string;

    @Column()
    imageId: string;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;
}