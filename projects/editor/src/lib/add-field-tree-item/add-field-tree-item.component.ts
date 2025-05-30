import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DndService, DragSourceDirective } from '@ng-dnd/core';
import { BehaviorSubject } from 'rxjs';

import { EditorService } from '../editor.service';
import { DropAction, FieldOption, IEditorFormlyField } from '../editor.types';
import { isCategoryOption, isTypeOption } from '../editor.utils';
import { FieldDragDrop } from '../field-drag-drop/field-drag-drop';
import { TreeItemComponent } from '../tree-item/tree-item.component';

@Component({
    selector: 'editor-add-field-tree-item',
    templateUrl: './add-field-tree-item.component.html',
    styleUrls: ['./add-field-tree-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TreeItemComponent, DragSourceDirective, AsyncPipe],
})
export class AddFieldTreeItemComponent implements OnChanges, OnDestroy {
    @Input() public fieldOption: FieldOption;
    @Input() public isExpanded = false;
    @Input() public treeLevel = 0;

    public isExpanded$ = new BehaviorSubject<boolean>(this.isExpanded);
    public isCategoryOption: boolean;
    public childOptions: FieldOption[] = [];

    public dnd: FieldDragDrop;

    private _field: IEditorFormlyField;

    constructor(
        private _editorService: EditorService,
        private _dndService: DndService
    ) {
        this.dnd = new FieldDragDrop(DropAction.COPY, this._editorService, this._dndService);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.fieldOption) {
            if (isCategoryOption(this.fieldOption)) {
                this.isCategoryOption = true;
                this.childOptions = this.fieldOption.children;
            } else if (isTypeOption(this.fieldOption)) {
                this._field = this._editorService.getDefaultField(this.fieldOption.name) as IEditorFormlyField;
                this.dnd.setup(this._field);
            }
        }

        if (changes.isExpanded) {
            this.isExpanded$.next(this.isExpanded);
        }
    }

    ngOnDestroy(): void {
        this.dnd.destroy();
    }
}
