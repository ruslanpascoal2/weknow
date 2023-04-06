import { Component, OnInit } from '@angular/core';
import { ProdutosService } from './produtos.service';
import { finalize, take } from 'rxjs';
import { Produto } from './produto.model';
import { MatDialog } from '@angular/material/dialog';
import { ProdutosFormComponent } from './produtos-form/produtos-form.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  loading = false;
  products: Produto[] = [];

  constructor(
    private produtosService: ProdutosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.produtosService
      .getProdutos()
      .pipe(
        take(1),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => (this.products = response));
  }

  deleteProduct(product: Produto) {
    this.loading = true;
    this.produtosService
      .deleteProduto(product._id!)
      .pipe(
        take(1),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => this.getProducts());
  }

  openProductForm(product?: Produto) {
    this.dialog
      .open(ProdutosFormComponent, {
        data: {
          product,
        },
      })
      .afterClosed()
      .pipe(
        take(1),
      )
      .subscribe((value) => {
        if (!!value) this.getProducts();
      });
  }

  openDeleteConfirmation(product: Produto) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: product
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((value: Produto | null) => {
        if (value) this.deleteProduct(value);
      });
  }
}
