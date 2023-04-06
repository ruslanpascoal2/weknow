import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdutosService } from '../produtos.service';
import { delay, finalize, take } from 'rxjs';
import { Produto } from '../produto.model';

@Component({
  selector: 'app-produtos-form',
  templateUrl: './produtos-form.component.html',
  styleUrls: ['./produtos-form.component.scss'],
})
export class ProdutosFormComponent implements OnInit {
  form!: FormGroup;
  loadingSubmit = false;

  constructor(
    public dialogRef: MatDialogRef<ProdutosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Produto },
    private fb: FormBuilder,
    private productsService: ProdutosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      description: ['', [Validators.required]],
    });

    if (this.data.product) {
      this.fillForm();
    }
  }

  get isEditing() {
    return !!this.data.product;
  }

  saveProduct() {
    this.loadingSubmit = true;

    const product: Produto = {
      descricao: this.form.value.description,
    };

    const service = this.isEditing
      ? this.productsService.updateProduto(this.data.product._id!, product)
      : this.productsService.createProduto(product);

    service
      .pipe(
        take(1),
        delay(1000),
        finalize(() => {
          this.loadingSubmit = false;
          this.dialogRef.close(true);
        })
      )
      .subscribe();
  }

  close() {
    this.dialogRef.close(null);
  }

  private fillForm() {
    this.productsService.getProduto(this.data.product._id!)
    .pipe(
      take(1)
    )
    .subscribe((product: Produto) => {
      this.form.patchValue({ description: product.descricao });
    })
  }
}
